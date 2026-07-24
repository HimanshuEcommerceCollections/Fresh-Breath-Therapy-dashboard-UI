"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { navigationGroups } from "@/src/data/layoutData/navigationData";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import SidebarNavGroup from "@/src/sections/layoutSections/SidebarNavGroup";
import SidebarProfileCard from "@/src/sections/layoutSections/SidebarProfileCard";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function Sidebar() {
  const { role, linkedTherapist } = useCurrentUser();

  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || (role && item.roles.includes(role))),
    }))
    .filter((group) => group.items.length > 0);

  // Section 1.4: Therapist role never shows this (redundant with their own
  // scoped nav); Admin/Coordinator only once a Therapist record is linked
  // to their email — confirmed via useCurrentUser's linkedTherapist lookup.
  const showProfileCard = role !== "Therapist" && linkedTherapist !== null;

  return (
    <aside
      className={`${inter.className} fixed left-0 top-0 z-50 flex h-screen w-63.75 flex-col bg-[#325A5E]`}
    >
      <div className="flex h-23.75 shrink-0 items-center px-4 py-5">
        <Image
          src="/dashboard/dashboardicons/sidebaricons/fbtIcon.png"
          alt="Fresh Breath Therapy"
          width={152}
          height={54}
          preload
          className="h-13.5 w-38 object-contain"
        />
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-2 scrollbar-none">
        {visibleGroups.map((group) => (
          <SidebarNavGroup key={group.groupLabel} group={group} />
        ))}
      </nav>

      {showProfileCard && linkedTherapist && (
        <SidebarProfileCard therapist={linkedTherapist} />
      )}
    </aside>
  );
}
