// src/app/verify-otp/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AuthBrandPanel from "@/src/components/authComponents/AuthBrandPanel";
import AuthFooterLinks from "@/src/components/authComponents/AuthFooterLinks";
import OtpVerificationSection from "@/src/sections/authSections/OtpVerificationSection";
import { otpContent } from "@/src/data/authData/otpData";
import { OtpFlow } from "@/src/hooks/useOtpForm";
import { pendingLoginService } from "@/src/services/authService";

/**
 * The address and the expiry used to arrive as query parameters:
 * /verify-otp?email=...&flow=login&expiresAt=...
 *
 * A URL is recorded in platform access logs, browser history and any referrer,
 * so that put a staff email address in three places it had no reason to be
 * (audit item 4.4). Only `flow` remains, which identifies nobody.
 *
 * Everything else comes from GET /api/auth/pending-login, which answers from
 * the httpOnly login-ticket cookie and returns a MASKED address — enough to
 * recognise which inbox to check, harmless if it is screenshotted or cached.
 */
const VerifyOtpContent = () => {
  const searchParams = useSearchParams();
  const flow: OtpFlow = searchParams.get("flow") === "login" ? "login" : "signup";

  const { data } = useQuery({
    queryKey: ["auth", "pending-login"],
    queryFn: pendingLoginService.fetch,
    // One shot. A 401 here means the ticket is gone, which retrying cannot fix.
    retry: false,
    staleTime: Infinity,
  });

  // Signup users go back to /signup if they need to change the email,
  // login users go back to /login instead.
  const changeEmailHref = flow === "login" ? "/login" : "/signup";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 lg:w-1/2">
      <OtpVerificationSection
        // Falls back to a generic phrase rather than a placeholder address, so
        // a slow or failed lookup never shows something that looks like a real
        // inbox.
        emailMasked={data?.emailMasked ?? "your email"}
        flow={flow}
        expiresAt={data?.expiresAt}
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
