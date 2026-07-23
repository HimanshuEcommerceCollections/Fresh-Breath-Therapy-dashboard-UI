// src/sections/authSections/OtpVerificationSection.tsx
"use client";

import Link from "next/link";
import StepProgressBar from "@/src/components/authComponents/StepProgressBar";
import OtpInputGroup from "@/src/components/authComponents/OtpInputGroup";
import PrimaryButton from "@/src/components/authComponents/PrimaryButton";
import { otpContent } from "@/src/data/authData/otpData";
import { useOtpForm, OtpFlow } from "@/src/hooks/useOtpForm";

interface OtpVerificationSectionProps {
  email: string;
  flow: OtpFlow;
  expiresAt?: string;
  changeEmailHref?: string;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const OtpVerificationSection = ({
  email,
  flow,
  expiresAt,
  changeEmailHref = "/signup",
}: OtpVerificationSectionProps) => {
  const {
    digits,
    setDigits,
    error,
    isSubmitting,
    isResending,
    secondsLeft,
    canResend,
    handleSubmit,
    handleResend,
  } = useOtpForm({ email, flow, expiresAt });

  return (
    <div className="flex w-full max-w-[448px] flex-col gap-10 rounded-3xl border border-[#C1C8C8]/30 bg-white p-10 shadow-[0_10px_40px_rgba(16,25,23,0.08)]">
      <StepProgressBar
        stepLabel={otpContent.stepLabel}
        badgeLabel={otpContent.stepBadge}
        progressPercent={100}
      />

      <div className="flex flex-col gap-2">
        <h2 className="font-manrope text-[32px] font-bold leading-tight text-[#141D1B]">
          {otpContent.heading}
        </h2>
        <p className="text-base text-[#5C6B69]">
          {otpContent.subheadingPrefix}
          <br />
          <span className="font-medium text-[#141D1B]">{email}</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-3">
          <OtpInputGroup
            length={otpContent.otpLength}
            values={digits}
            onChange={setDigits}
            error={error ?? undefined}
            disabled={isSubmitting}
          />
          <p className="text-center text-sm font-semibold text-[#5C6B69]">
            {otpContent.helperText}
          </p>
        </div>

        <PrimaryButton
          label={otpContent.submitLabel}
          isLoading={isSubmitting}
          className="!rounded-lg"
        />

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="text-sm font-semibold text-[#5C6B69] transition-opacity disabled:opacity-50"
          >
            {otpContent.resendPrompt} {otpContent.resendCta}
          </button>

          {secondsLeft > 0 && (
            <p className="text-xs text-[#5C6B69]/70">
              {otpContent.resendTimerLabel} {formatTime(secondsLeft)}
            </p>
          )}

          <Link
            href={changeEmailHref}
            className="text-sm font-semibold text-[#143A3D] hover:underline"
          >
            {otpContent.changeEmailLabel}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default OtpVerificationSection;