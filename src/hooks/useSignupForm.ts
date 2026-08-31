// src/hooks/useSignupForm.ts
"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signupService, loginWithGoogle } from "@/src/services/authService";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from "@/src/lib/validation";

export interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
}

type SignupFormErrors = Partial<Record<keyof SignupFormValues, string>>;

const initialValues: SignupFormValues = {
  fullName: "",
  email: "",
  password: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useSignupForm = () => {
  const router = useRouter();
  const [values, setValues] = useState<SignupFormValues>(initialValues);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // clear the field error as soon as the user edits it
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const nextErrors: SignupFormErrors = {};

    if (!values.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    } else if (values.fullName.trim().length > MAX_NAME_LENGTH) {
      nextErrors.fullName = `Full name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    } else if (values.email.trim().length > MAX_EMAIL_LENGTH) {
      nextErrors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
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
      const res = await signupService.createAccount(values);

      if (!res.success) {
        setServerError(res.message ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // See useLoginForm: nothing identifying goes in the URL.
      router.push("/verify-otp?flow=signup");
      // Leave isSubmitting true through the redirect — see useOtpForm's
      // handleSubmit for why resetting it here would let a second click
      // through before the route actually changes.
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = () => {
    // Same /api/auth/google/login endpoint as the login page — the backend
    // decides new-account-vs-existing itself and redirects back with the
    // appropriate status.
    loginWithGoogle();
  };

  return {
    values,
    errors,
    isSubmitting,
    serverError,
    handleChange,
    handleSubmit,
    handleGoogleSignup,
  };
};