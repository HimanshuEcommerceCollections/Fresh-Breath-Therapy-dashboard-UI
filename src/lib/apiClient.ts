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

// ── stale-navigation request cancellation ──────────────────────────────────
//
// The symptom this fixes: open a page (it fires a GET), navigate away before
// the response lands, open another page — the first page's request finally
// resolves (often as a 500, since by then whatever it was reading may have
// changed) against a component that no longer exists, and the global error
// toast fires anyway. It reads as "random API failures that go away on
// retry," but it's not the API — it's a response for a page you've already
// left.
//
// Every request is tagged with the pathname that was active when it was
// sent. `cancelStaleRequests(activePathname)` aborts any still-pending GET
// tagged with a DIFFERENT pathname — i.e. requests left over from wherever
// you just navigated away from. Comparing by tag (not by timing) means this
// is safe regardless of React's effect-ordering: a request the new page
// itself just fired is tagged with the new pathname and is never touched.
// Mutations (POST/PATCH/DELETE/PUT) are never auto-cancelled — the server
// may already be acting on one, and aborting the client side of it would
// desync the UI from what actually happened.
let currentPathname = "";

interface PendingEntry {
  controller: AbortController;
  pathname: string;
  method: string;
}

const pendingRequests = new Map<symbol, PendingEntry>();
const CANCEL_ID = Symbol("cancelId");

export function setActivePathname(pathname: string): void {
  currentPathname = pathname;
}

export function cancelStaleRequests(activePathname: string): void {
  for (const [id, entry] of pendingRequests) {
    if (entry.pathname !== activePathname && entry.method === "get") {
      entry.controller.abort();
      pendingRequests.delete(id);
    }
  }
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.idempotent) {
    const key = config.idempotencyKey || crypto.randomUUID();
    config.headers.set("Idempotency-Key", key);
  }

  // Respect a caller-supplied signal (e.g. a manual abort elsewhere) instead
  // of overriding it.
  if (!config.signal) {
    const controller = new AbortController();
    const id = Symbol();
    (config as InternalAxiosRequestConfig & { [CANCEL_ID]?: symbol })[CANCEL_ID] = id;
    pendingRequests.set(id, {
      controller,
      pathname: currentPathname,
      method: (config.method || "get").toLowerCase(),
    });
    config.signal = controller.signal;
  }
  return config;
});

function clearPending(config: InternalAxiosRequestConfig | undefined) {
  const id = (config as (InternalAxiosRequestConfig & { [CANCEL_ID]?: symbol }) | undefined)?.[CANCEL_ID];
  if (id) pendingRequests.delete(id);
}

interface ErrorResponseBody {
  detail?: string | { message?: string } | Array<{ msg?: string }>;
}

const GENERIC_FALLBACK_MESSAGE = "Something went wrong. Please try again.";

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
  return GENERIC_FALLBACK_MESSAGE;
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
  (response) => {
    clearPending(response.config);
    return response;
  },
  async (error: AxiosError<ErrorResponseBody>) => {
    clearPending(error.config);

    // A request cancelled because the user navigated away is not a failure
    // to report — the page that cared about the answer is already gone.
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

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

    const message = errorDetailToMessage(error);
    // The generic fallback fires for exactly the responses that carry no
    // actionable detail — a bare 500, a network blip, a request that raced
    // a page change and landed after something changed underneath it. There
    // is nothing useful to tell the user in that case ("something went
    // wrong" isn't information), and it's the message behind most of the
    // spurious "the API is broken" reports that turn out to be nothing on
    // retry. Real, actionable errors (validation messages, permission
    // errors, 409 conflicts) always carry a specific `detail` and still
    // surface normally below.
    if (message === GENERIC_FALLBACK_MESSAGE) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("[apiClient] suppressed generic error toast:", url, error);
      }
    } else if (!error.config?.skipErrorToast) {
      showErrorToast(message);
    }

    return Promise.reject(error);
  }
);

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

export default apiClient;
