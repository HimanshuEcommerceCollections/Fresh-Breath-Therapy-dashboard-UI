// src/hooks/useLoginForm.ts
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginService, loginWithGoogle } from "@/src/services/authService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

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
    setServerError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await loginService.login(values);

      if (!res.success) {
        setServerError(res.message ?? "Invalid email or password.");
        return;
      }

      if (res.otpRequired) {
        const expiresAtParam = res.expiresAt
          ? `&expiresAt=${encodeURIComponent(res.expiresAt)}`
          : "";
        router.push(
          `/verify-otp?email=${encodeURIComponent(values.email)}&flow=login${expiresAtParam}`
        );
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
    } finally {
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