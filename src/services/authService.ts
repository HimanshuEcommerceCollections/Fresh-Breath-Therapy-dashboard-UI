import { SignupFormValues } from "@/src/hooks/useSignupForm";
import { LoginFormValues } from "@/src/hooks/useLoginForm";

export interface AuthResponse {
  success: boolean;
  message?: string;
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