"use client";

import HeaderSidebarToggle from "@/src/sections/layoutSections/HeaderSidebarToggle";
import HeaderSearchBar from "@/src/sections/layoutSections/HeaderSearchBar";
import HeaderNotificationButton from "@/src/sections/layoutSections/HeaderNotificationButton";
import HeaderProfileAvatar from "@/src/sections/layoutSections/HeaderProfileAvatar";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

export default function Header() {
  const { user, linkedTherapist } = useCurrentUser();

  // Role-agnostic: shown for any role (Admin, Coordinator, or Therapist)
  // as long as the logged-in user has a linked Therapist record. A real
  // Therapist-role account always has one — it's only ever approved because
  // a matching Therapist record exists and gets linked at approval time —
  // so this naturally covers that case too without a separate branch.
  const showAvatar = user && linkedTherapist !== null;

  return (
    <header className="fixed left-63.75 right-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-[#E0E5EB] bg-[rgba(247,251,253,0.8)] px-6 backdrop-blur-md">
      <HeaderSidebarToggle />
      <HeaderSearchBar />
      <div className="flex-1" />
      <HeaderNotificationButton />
      {showAvatar && user && linkedTherapist && (
        <HeaderProfileAvatar user={user} therapist={linkedTherapist} />
      )}
    </header>
  );
}
