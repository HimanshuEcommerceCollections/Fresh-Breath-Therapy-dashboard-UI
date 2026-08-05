// src/app/verify-otp/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthBrandPanel from "@/src/components/authComponents/AuthBrandPanel";
import AuthFooterLinks from "@/src/components/authComponents/AuthFooterLinks";
import OtpVerificationSection from "@/src/sections/authSections/OtpVerificationSection";
import { otpContent } from "@/src/data/authData/otpData";
import { OtpFlow } from "@/src/hooks/useOtpForm";

const VerifyOtpContent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "you@clinic.com";
  const flow: OtpFlow = searchParams.get("flow") === "login" ? "login" : "signup";
  const expiresAt = searchParams.get("expiresAt") ?? undefined;

  // Signup users go back to /signup if they need to change the email,
  // login users go back to /login instead.
  const changeEmailHref = flow === "login" ? "/login" : "/signup";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 lg:w-1/2">
      <OtpVerificationSection
        email={email}
        flow={flow}
        expiresAt={expiresAt}
        changeEmailHref={changeEmailHref}
      />
      <AuthFooterLinks links={otpContent.footerLinks} />
    </div>
  );
};

export default function VerifyOtpPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Content grid */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center gap-8 p-5 lg:p-8">
        <div className="hidden h-[calc(100vh-64px)] w-1/2 lg:block">
          <AuthBrandPanel />
        </div>

        <Suspense fallback={null}>
          <VerifyOtpContent />
        </Suspense>
      </div>
    </main>
  );
}