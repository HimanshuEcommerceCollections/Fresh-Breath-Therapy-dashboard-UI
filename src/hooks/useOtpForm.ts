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
}

export const useOtpForm = ({
  email,
  flow,
  length = otpContent.otpLength,
}: UseOtpFormOptions) => {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    otpContent.resendCooldownSeconds
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setSecondsLeft(otpContent.resendCooldownSeconds);

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
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startCountdown]);

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
      await otpService.resendOtp({ email, flow });
      startCountdown();
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