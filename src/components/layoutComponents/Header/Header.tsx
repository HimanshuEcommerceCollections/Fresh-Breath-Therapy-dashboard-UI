"use client";

import HeaderSidebarToggle from "@/src/sections/layoutSections/HeaderSidebarToggle";
import HeaderSearchBar from "@/src/sections/layoutSections/HeaderSearchBar";
import HeaderNotificationButton from "@/src/sections/layoutSections/HeaderNotificationButton";
import HeaderProfileAvatar from "@/src/sections/layoutSections/HeaderProfileAvatar";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

export default function Header() {
  const { user, role, linkedTherapist } = useCurrentUser();

  // Section 1.4: Therapist role never shows their own avatar here (same
  // rule as the sidebar's profile card); Admin/Coordinator only once a
  // Therapist record is linked to their email.
  const showAvatar = user && role !== "Therapist" && linkedTherapist !== null;

  return (
    <header className="fixed left-63.75 right-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-[#E0E5EB] bg-[rgba(247,251,253,0.8)] px-6 backdrop-blur-md">
      <HeaderSidebarToggle />
      <HeaderSearchBar />
      <div className="flex-1" />
      <HeaderNotificationButton />
      {showAvatar && user && <HeaderProfileAvatar user={user} />}
    </header>
  );
}
