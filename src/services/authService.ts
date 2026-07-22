// src/services/authService.ts
//
// TODO: Wire real endpoints once API documentation (endpoints/request/response
// shapes) is provided. Keeping the function signatures stable now so the hook
// layer (useSignupForm, useLoginForm, useOtpForm) doesn't need to change later —
// only the implementation inside these functions will.

import { SignupFormValues } from "@/src/hooks/useSignupForm";
import { LoginFormValues } from "@/src/hooks/useLoginForm";
import { OtpFlow } from "@/src/types/auth";

export interface AuthResponse {
  success: boolean;
  message?: string;
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

export const signupService = {
  async createAccount(_values: SignupFormValues): Promise<AuthResponse> {
    // TODO: replace with real POST /auth/signup call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 800)
    );
  },
};

export const loginService = {
  async login(_values: LoginFormValues): Promise<AuthResponse> {
    // TODO: replace with real POST /auth/login call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 800)
    );
  },
};

export const otpService = {
  async verifyOtp(_payload: VerifyOtpPayload): Promise<AuthResponse> {
    // TODO: replace with real POST /auth/verify-otp call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 800)
    );
  },

  async resendOtp(_payload: ResendOtpPayload): Promise<AuthResponse> {
    // TODO: replace with real POST /auth/resend-otp call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 600)
    );
  },
};