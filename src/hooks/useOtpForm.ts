// src/hooks/useOtpForm.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { otpService } from "@/src/services/authService";
import { otpContent } from "@/src/data/authData/otpData";
import { OtpFlow } from "@/src/types/auth";

export type { OtpFlow };

interface UseOtpFormOptions {
  email: string;
  flow: OtpFlow;
  length?: number;
  /**
   * Absolute UTC timestamp from the login/signup/resend response
   * (`expires_at`). When present, the countdown is derived from it so it
   * survives a page refresh, per backend doc section 3.2. Falls back to the
   * static cooldown constant if absent (e.g. direct navigation to this page).
   */
  expiresAt?: string;
}

function secondsUntil(expiresAt?: string): number {
  if (!expiresAt) return otpContent.resendCooldownSeconds;
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.round(remainingMs / 1000));
}

export const useOtpForm = ({
  email,
  flow,
  length = otpContent.otpLength,
  expiresAt,
}: UseOtpFormOptions) => {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(expiresAt));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback((fromExpiresAt?: string) => {
    setSecondsLeft(secondsUntil(fromExpiresAt));

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown(expiresAt);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const code = digits.join("");
  const isComplete = code.length === length && !digits.includes("");
  const canResend = secondsLeft === 0 && !isResending;

  const handleSubmit = async () => {
    setError(null);

    if (!isComplete) {
      setError(`Enter all ${length} digits.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await otpService.verifyOtp({ email, code, flow });

      if (!res.success) {
        setError(res.message ?? "That code didn't work. Please try again.");
        return;
      }

      // Both flows land on the dashboard once verified. If signup ever needs
      // an onboarding step instead, branch here on `flow === "signup"`.
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError(null);
    setDigits(Array(length).fill(""));

    try {
      setIsResending(true);
      const res = await otpService.resendOtp({ email, flow });
      if (!res.success) {
        // 429 cooldown-not-elapsed detail is already toasted by apiClient;
        // don't restart the countdown since the resend didn't actually happen.
        setError(res.message ?? "Couldn't resend the code. Please try again.");
        return;
      }
      startCountdown(res.expiresAt);
    } catch {
      setError("Couldn't resend the code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    digits,
    setDigits,
    error,
    isSubmitting,
    isResending,
    secondsLeft,
    canResend,
    handleSubmit,
    handleResend,
  };
};