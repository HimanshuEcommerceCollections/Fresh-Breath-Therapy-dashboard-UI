"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/src/data/layoutData/navigationData";

export default function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={[
        "flex h-8 w-full items-center gap-3 p-2 text-sm tracking-[-0.154px] transition-colors",
        isActive
          ? "rounded-lg bg-white font-medium text-[#325A5E] shadow-[-3px_4px_12px_rgba(0,0,0,0.25)]"
          : "cursor-pointer rounded-xl font-normal text-[#E6ECF2] hover:bg-white/[0.08]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="h-4 w-4 shrink-0 bg-current"
        style={{
          WebkitMaskImage: `url(${item.icon})`,
          maskImage: `url(${item.icon})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <span>{item.label}</span>
    </Link>
  );
}
