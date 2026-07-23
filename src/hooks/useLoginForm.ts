// src/hooks/useLoginForm.ts
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "@/src/services/authService";

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

      const expiresAtParam = res.expiresAt
        ? `&expiresAt=${encodeURIComponent(res.expiresAt)}`
        : "";
      router.push(
        `/verify-otp?email=${encodeURIComponent(values.email)}&flow=login${expiresAtParam}`
      );
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: kick off Google OAuth flow once backend redirect URL is available
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