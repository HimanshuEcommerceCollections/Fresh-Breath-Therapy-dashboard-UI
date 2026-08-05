import { Suspense } from "react";
import AuthBrandPanel from "@/src/components/authComponents/AuthBrandPanel";
import LoginFormSection from "@/src/sections/authSections/LoginFormSection";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Content grid */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center gap-8 p-5 lg:p-8">
        <div className="hidden h-[calc(100vh-64px)] w-1/2 lg:block">
          <AuthBrandPanel />
        </div>

        <div className="flex w-full items-center justify-center lg:w-1/2">
          <Suspense fallback={null}>
            <LoginFormSection />
          </Suspense>
        </div>
      </div>
    </main>
  );
}