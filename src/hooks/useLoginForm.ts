// src/hooks/useLoginForm.ts
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginService, loginWithGoogle } from "@/src/services/authService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { MAX_EMAIL_LENGTH } from "@/src/lib/validation";

export interface LoginFormValues {
  email: string;
  password: string;
}

type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginForm = () => {
  const router = useRouter();
  const { refetch } = useCurrentUser();
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: LoginFormErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (values.email.trim().length > MAX_EMAIL_LENGTH) {
      nextErrors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
    } else if (!emailRegex.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await loginService.login(values);

      if (!res.success) {
        setServerError(res.message ?? "Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      if (res.otpRequired) {
        // Only the flow, which is not PHI. The address and expiry used to ride
        // here and a URL is recorded in platform access logs, browser history
        // and any referrer (audit item 4.4). The OTP page asks
        // GET /api/auth/pending-login instead, which answers from the httpOnly
        // login-ticket cookie and returns a MASKED address.
        router.push("/verify-otp?flow=login");
        // Leave isSubmitting true through the redirect — see useOtpForm's
        // handleSubmit for why resetting it here would let a second click
        // through before the route actually changes.
        return;
      }

      // EMAIL_SERVICE is off backend-side — login already completed and set
      // the session cookie, so go straight to the home page. CurrentUserProvider
      // only checks the session once on initial app mount, so without this
      // refetch it still holds user: null and ProtectedShell bounces us
      // straight back to /login after the push.
      await refetch();
      router.push("/");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return {
    values,
    errors,
    isSubmitting,
    serverError,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  };
};