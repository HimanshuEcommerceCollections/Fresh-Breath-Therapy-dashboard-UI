// src/services/authService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 3.3.
// Every 2xx response here carries a user-facing `detail` string per the docs
// ("OTP sent", "Login successful", etc.) — surfaced as a toast exactly as
// worded by the backend, in addition to the existing inline serverError UI
// the hooks already render.

import { AxiosError } from "axios";
import { apiClient, newIdempotencyKey, API_BASE_URL } from "@/src/lib/apiClient";
import { showSuccessToast } from "@/src/lib/toast";
import { SignupFormValues } from "@/src/hooks/useSignupForm";
import { LoginFormValues } from "@/src/hooks/useLoginForm";
import { OtpFlow } from "@/src/types/auth";

export interface AuthResponse {
  success: boolean;
  message?: string;
  expiresAt?: string;
  otpRequired?: boolean;
  /** Present on a successful LOGIN otp verification — lets the caller seed
   *  the session and navigate without a further /me round trip. */
  user?: CurrentUser;
}

export type RoleName = "Admin" | "Coordinator" | "Therapist";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  role: RoleName | null;
}

interface ApiCurrentUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  role: { id: string; name: RoleName; permissions: Record<string, unknown> } | null;
}

// One mapper for both /api/auth/me and the user returned by
// verify-login-otp, so the two can never disagree about the shape.
export function toCurrentUser(raw: ApiCurrentUser): CurrentUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    avatarUrl: raw.avatar_url,
    isActive: raw.is_active,
    role: raw.role?.name ?? null,
  };
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
  flow: OtpFlow;
}

export interface ResendOtpPayload {
  email: string;
  flow: OtpFlow;
}

function failureMessage(err: unknown, fallback: string): string {
  const error = err as AxiosError<{ detail?: unknown }>;
  const detail = error.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}

export const signupService = {
  async createAccount(values: SignupFormValues): Promise<AuthResponse> {
    try {
      const res = await apiClient.post(
        "/api/auth/signup",
        { name: values.fullName, email: values.email, password: values.password },
        { idempotent: true, idempotencyKey: newIdempotencyKey() }
      );
      showSuccessToast(res.data.detail);
      return { success: true, message: res.data.detail, expiresAt: res.data.expires_at };
    } catch (err) {
      return { success: false, message: failureMessage(err, "Something went wrong. Please try again.") };
    }
  },
};

export const loginService = {
  async login(values: LoginFormValues): Promise<AuthResponse> {
    try {
      const res = await apiClient.post(
        "/api/auth/login",
        { email: values.email, password: values.password },
        { idempotent: true, idempotencyKey: newIdempotencyKey() }
      );
      showSuccessToast(res.data.detail);
      return {
        success: true,
        message: res.data.detail,
        expiresAt: res.data.expires_at,
        otpRequired: res.data.otp_required,
      };
    } catch (err) {
      return { success: false, message: failureMessage(err, "Invalid email or password.") };
    }
  },
};

// GET /api/auth/google/login returns a 307 redirect straight to Google's
// consent screen — there is no JSON body, so this must be a real browser
// navigation, never an apiClient/Axios call (an XHR can't follow that
// redirect chain and just fails with a CORS error). The backend eventually
// redirects back to /login with a `status` param (see LoginFormSection) or
// straight to the dashboard once the session cookie is set.
export function loginWithGoogle(): void {
  window.location.href = `${API_BASE_URL}/api/auth/google/login`;
}

export const otpService = {
  async verifyOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
    const endpoint =
      payload.flow === "login"
        ? "/api/auth/verify-login-otp"
        : "/api/auth/verify-signup-otp";
    try {
      const res = await apiClient.post(
        endpoint,
        { email: payload.email, code: payload.code },
        { idempotent: true, idempotencyKey: newIdempotencyKey() }
      );
      showSuccessToast(res.data.detail);
      return {
        success: true,
        message: res.data.detail,
        user: res.data.user ? toCurrentUser(res.data.user) : undefined,
      };
    } catch (err) {
      return { success: false, message: failureMessage(err, "That code didn't work. Please try again.") };
    }
  },

  async resendOtp(payload: ResendOtpPayload): Promise<AuthResponse> {
    try {
      const res = await apiClient.post("/api/auth/resend-otp", {
        email: payload.email,
        purpose: payload.flow,
      });
      showSuccessToast(res.data.detail);
      return { success: true, message: res.data.detail, expiresAt: res.data.expires_at };
    } catch (err) {
      return { success: false, message: failureMessage(err, "Couldn't resend the code. Please try again.") };
    }
  },
};

export const sessionAuthService = {
  async me(): Promise<CurrentUser> {
    const res = await apiClient.get<ApiCurrentUser>("/api/auth/me", {
      skipErrorToast: true,
    });
    return toCurrentUser(res.data);
  },

  async logout(): Promise<AuthResponse> {
    try {
      const res = await apiClient.post("/api/auth/logout");
      showSuccessToast(res.data.detail);
      return { success: true, message: res.data.detail };
    } catch (err) {
      return { success: false, message: failureMessage(err, "Something went wrong. Please try again.") };
    }
  },
};
