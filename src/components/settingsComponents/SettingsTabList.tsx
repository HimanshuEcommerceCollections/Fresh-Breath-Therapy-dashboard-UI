"use client";

import {
  Bell,
  Building2,
  Globe,
  Lock,
  Package,
  Plug,
  UsersRound,
  Zap,
} from "lucide-react";
import SettingsTab from "@/src/sections/settingsSections/SettingsTab";

export type SettingsTabName =
  | "Organization"
  | "Roles"
  | "Packages"
  | "Automation"
  | "Notifications"
  | "Integrations"
  | "SaaS"
  | "Security";

// Icons are lucide line icons as stand-ins — swap for dedicated assets once
// they're supplied.
const TABS: { name: SettingsTabName; icon: typeof Building2 }[] = [
  { name: "Organization", icon: Building2 },
  { name: "Roles", icon: UsersRound },
  { name: "Packages", icon: Package },
  { name: "Automation", icon: Zap },
  { name: "Notifications", icon: Bell },
  { name: "Integrations", icon: Plug },
  { name: "SaaS", icon: Globe },
  { name: "Security", icon: Lock },
];

export default function SettingsTabList({
  activeTab,
  onChange,
}: {
  activeTab: SettingsTabName;
  onChange: (tab: SettingsTabName) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center self-start rounded-[14px] bg-[#EFF4FA] p-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <SettingsTab
            key={tab.name}
            label={tab.name}
            icon={<Icon size={14} />}
            active={activeTab === tab.name}
            onClick={() => onChange(tab.name)}
          />
        );
      })}
    </div>
  );
}
