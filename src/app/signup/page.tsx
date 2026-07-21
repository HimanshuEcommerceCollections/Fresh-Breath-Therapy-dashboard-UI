import AuthBrandPanel from "@/src/components/authComponents/AuthBrandPanel";
import SignupFormSection from "@/src/sections/authSections/SignupFormSection";

export default function SignupPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F9FCFF]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D2F5FF] via-[#F3FAFF] to-[#BCEDFF]" />

      {/* Corner glow blobs */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#00C2EF]/50 opacity-60 blur-[64px]" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#2CA2FF]/55 opacity-50 blur-[64px]" />

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
