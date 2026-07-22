"use client";

// SidebarSignupRequestsItem — special nav item for Signup Requests that shows
// a live pending-count badge. This is a client component because it reads from
// the signupRequestsMock data to derive the count; once the API is live the
// count will come from a shared store or server component prop.
//
// Kept self-contained so the rest of the sidebar (server component) doesn't
// need to become a client component just for one badge.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { signupRequestsMock } from "@/src/data/signupRequestsData/signupRequestsData";
import type { NavItem } from "@/src/data/layoutData/navigationData";

export default function SidebarSignupRequestsItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  // Derive pending count directly from the mock data (same source as the hook).
  // TODO: Replace with a shared context/store once the API is live.
  const pendingCount = useMemo(
    () => signupRequestsMock.filter((r) => r.status === "Pending").length,
    [],
  );

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
      {/* Masked icon — same technique as SidebarNavItem */}
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

      <span className="flex-1 truncate">{item.label}</span>

      {/* Pending count badge — only shown when count > 0 */}
      {pendingCount > 0 && (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white">
          {pendingCount}
        </span>
      )}
    </Link>
  );
}
