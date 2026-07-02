import type { NavGroup } from "@/src/data/layoutData/navigationData";
import SidebarNavItem from "@/src/sections/layoutSections/SidebarNavItem";

export default function SidebarNavGroup({ group }: { group: NavGroup }) {
  return (
    <div>
      <div className="flex h-8 items-center px-2 text-xs font-medium uppercase tracking-[0.6px] text-[rgba(230,236,242,0.6)]">
        {group.groupLabel}
      </div>
      <div className="flex flex-col gap-1">
        {group.items.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}
