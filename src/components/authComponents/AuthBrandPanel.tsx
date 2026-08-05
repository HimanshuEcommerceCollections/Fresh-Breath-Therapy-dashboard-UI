// src/components/authComponents/AuthBrandPanel.tsx
import Image from "next/image";
import { authBrandContent } from "@/src/data/authData/authBrandData";
import AvatarStack from "./AvatarStack";

const AuthBrandPanel = () => {
  const {
    trustBadge,
    heading,
    subheading,
    avatarStack,
    socialProofTitle,
    socialProofSubtitle,
    footerNote,
    shieldIconUrl,
  } = authBrandContent;

  return (
    <section className="relative hidden h-full w-full flex-col justify-between overflow-hidden rounded-[32px] bg-[#325A5E] p-10 text-white lg:flex">
      {/* Logo — same asset as the sidebar (Sidebar.tsx), not a placeholder */}
      <Image
        src="/dashboard/dashboardicons/sidebaricons/fbtIcon.png"
        alt="Fresh Breath Therapy"
        width={152}
        height={54}
        className="h-12 w-auto self-start object-contain"
      />

      {/* Middle content */}
      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-xs font-medium backdrop-blur-md">
          <Image src={shieldIconUrl} alt="" width={14} height={14} />
          {trustBadge}
        </span>

        <h1 className="font-sora text-[44px] font-bold leading-[1.05] tracking-tight">
          {heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="max-w-[380px] text-base leading-relaxed text-white/85">
          {subheading}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <AvatarStack avatars={avatarStack} />
          <div>
            <p className="text-sm font-semibold text-white/90">
              {socialProofTitle}
            </p>
            <p className="text-xs text-white/70">{socialProofSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-white/75">
        <Image src={shieldIconUrl} alt="" width={16} height={16} />
        {footerNote}
      </div>
    </section>
  );
};

export default AuthBrandPanel;