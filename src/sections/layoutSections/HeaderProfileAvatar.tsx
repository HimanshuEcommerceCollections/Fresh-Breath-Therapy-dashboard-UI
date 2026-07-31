"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { CurrentUser } from "@/src/services/authService";
import type { Therapist } from "@/src/services/therapistsService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

export default function HeaderProfileAvatar({
  user,
  therapist,
}: {
  user: CurrentUser;
  /** The linked Therapist record — this drives the avatar image/initials,
   * not `user`, so the navbar shows the same identity as the Sidebar's
   * profile card. */
  therapist: Therapist;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  async function handleLogout() {
    setIsOpen(false);
    await logout();
    router.replace("/login");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={`${therapist.name} profile menu`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-[#325A5E] bg-[#376EF4]"
      >
        {therapist.avatarUrl ? (
          <Image
            src={therapist.avatarUrl}
            alt={therapist.name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
            {therapist.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#E2E8F0] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#0F172A]">{user.name}</p>
            <p className="truncate text-xs text-[#64748B]">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-[#DC2626] transition-colors hover:bg-[#FEF2F2]"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
