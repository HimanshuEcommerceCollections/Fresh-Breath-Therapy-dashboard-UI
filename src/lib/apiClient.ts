import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { showErrorToast } from "@/src/lib/toast";

// Exported so anything that needs a full-page browser navigation to the
// backend (e.g. the Google OAuth redirect, which can't go through Axios —
// see authService.ts) targets the exact same host as every XHR call here.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fresh-breath-therapy-dashboard-serv.vercel.app";

declare module "axios" {
  export interface AxiosRequestConfig {
    idempotent?: boolean;
    idempotencyKey?: string;
    skipErrorToast?: boolean;
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

// Endpoints where a 401 doesn't mean "an existing session died" — it's part
// of the normal auth flow itself (wrong password, not-yet-verified OTP, the
// routine "am I logged in?" probe on every app load) and is already handled
// inline by whatever called it. Re-checking /me or force-redirecting on
// these would either loop or fire on a page the user is already on.
const AUTH_FLOW_PATHS = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/verify-login-otp",
  "/api/auth/verify-signup-otp",
  "/api/auth/resend-otp",
  "/api/auth/me",
  "/api/auth/google",
];

function isAuthFlowRequest(url: string | undefined): boolean {
  return !!url && AUTH_FLOW_PATHS.some((path) => url.includes(path));
}

const PUBLIC_ROUTES = ["/login", "/signup", "/verify-otp"];

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (PUBLIC_ROUTES.some((route) => window.location.pathname.startsWith(route))) return;
  // Hard navigation, not a router.push — this must fully reset every piece
  // of client state (React Query cache, CurrentUserProvider, component
  // state) rather than leave stale authenticated UI mounted behind a
  // client-side redirect.
  window.location.href = "/login";
}

// Any 401 on a real resource request re-checks /api/auth/me immediately: if
// the session is still valid, this 401 was something else and just gets
// surfaced normally; if /me also 401s, the session is genuinely gone
// (expired, logged out elsewhere, token revoked) and the user is sent to
// /login right away instead of being left looking at a dead page.
let isVerifyingSession = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseBody>) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !isAuthFlowRequest(url) && !isVerifyingSession) {
      isVerifyingSession = true;
      try {
        await apiClient.get("/api/auth/me", { skipErrorToast: true });
      } catch (meError) {
        if (meError instanceof AxiosError && meError.response?.status === 401) {
          isVerifyingSession = false;
          redirectToLogin();
          return Promise.reject(error);
        }
      } finally {
        isVerifyingSession = false;
      }
    }

    if (!error.config?.skipErrorToast) {
      showErrorToast(errorDetailToMessage(error));
    }
    return Promise.reject(error);
  }
);

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

export default apiClient;
