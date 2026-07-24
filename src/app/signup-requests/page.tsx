"use client";

// src/app/signup-requests/page.tsx
import SignupRequestsSection from "@/src/sections/signupRequestsSections/SignupRequestsSection";
import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function SignupRequestsPage() {
  const { isChecking } = useRequireRole(["Admin"], "/leads");

  if (isChecking) return null;

  return (
    <main className="min-h-screen w-full bg-[#F8FAFC]">
      <SignupRequestsSection />
    </main>
  );
}
