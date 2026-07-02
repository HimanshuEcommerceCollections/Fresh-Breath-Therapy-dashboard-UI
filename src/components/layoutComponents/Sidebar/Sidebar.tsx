import Image from "next/image";
import { Inter } from "next/font/google";
import { navigationGroups } from "@/src/data/layoutData/navigationData";
import { currentUser } from "@/src/data/layoutData/userData";
import SidebarNavGroup from "@/src/sections/layoutSections/SidebarNavGroup";
import SidebarProfileCard from "@/src/sections/layoutSections/SidebarProfileCard";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function Sidebar() {
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
        {navigationGroups.map((group) => (
          <SidebarNavGroup key={group.groupLabel} group={group} />
        ))}
      </nav>

      <SidebarProfileCard user={currentUser} />
    </aside>
  );
}
