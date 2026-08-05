import AuthBrandPanel from "@/src/components/authComponents/AuthBrandPanel";
import SignupFormSection from "@/src/sections/authSections/SignupFormSection";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Content grid */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] items-center gap-8 p-5 lg:p-8">
        <div className="hidden h-[calc(100vh-64px)] w-1/2 lg:block">
          <AuthBrandPanel />
        </div>

        <div className="flex w-full items-center justify-center lg:w-1/2">
          <SignupFormSection />
        </div>
      </div>
    </main>
  );
}
