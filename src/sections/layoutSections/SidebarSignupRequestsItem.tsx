"use client";

// SidebarSignupRequestsItem — special nav item for Signup Requests that shows
// a live pending-count badge, sourced from GET /api/auth/role-requests
// (status_filter=pending). Polls on the same cadence as the notifications
// summary badge so it stays reasonably fresh without a shared store.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signupRequestsService } from "@/src/services/signupRequestsService";
import type { NavItem } from "@/src/data/layoutData/navigationData";

const POLL_INTERVAL_MS = 45000;

export default function SidebarSignupRequestsItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const refetch = () => {
      signupRequestsService
        .fetchSignupRequests("pending")
        .then((data) => {
          if (mounted) setPendingCount(data.length);
        })
        .catch(() => {
          // Error toast already surfaced by the apiClient interceptor.
        });
    };

    refetch();
    const interval = setInterval(refetch, POLL_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

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
