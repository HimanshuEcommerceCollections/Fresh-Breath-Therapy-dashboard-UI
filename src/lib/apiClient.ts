import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { showErrorToast } from "@/src/lib/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fresh-breath-therapy-dashboard-server.onrender.com";

declare module "axios" {
  export interface AxiosRequestConfig {
    idempotent?: boolean;
    idempotencyKey?: string;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.idempotent) {
    const key = config.idempotencyKey || crypto.randomUUID();
    config.headers.set("Idempotency-Key", key);
  }
  return config;
});

interface ErrorResponseBody {
  detail?: string | { message?: string } | Array<{ msg?: string }>;
}

// Section 1.6: `detail` is a string on every documented status EXCEPT the
// 409 session double-booking shape, which is an object — that one gets its
// own message rather than being stringified.
function errorDetailToMessage(error: AxiosError<ErrorResponseBody>): string {
  const status = error.response?.status;
  const detail = error.response?.data?.detail;

  if (status === 409 && detail && typeof detail === "object" && !Array.isArray(detail)) {
    return typeof detail.message === "string"
      ? detail.message
      : "This time slot conflicts with an existing session.";
  }
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    // 422 Pydantic validation errors: [{ loc, msg, type }]
    const first = detail.find((d) => typeof d?.msg === "string");
    return first?.msg ?? "Validation error.";
  }
  return "Something went wrong. Please try again.";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponseBody>) => {
    showErrorToast(errorDetailToMessage(error));
    return Promise.reject(error);
  }
);

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

export default apiClient;
