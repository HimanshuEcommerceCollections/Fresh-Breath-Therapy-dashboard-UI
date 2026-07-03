"use client";

import {
  BarChart3,
  DollarSign,
  Gauge,
  Repeat,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import ReportTab from "@/src/sections/reportsSections/ReportTab";

export type ReportTabName =
  | "Sales"
  | "Clients"
  | "Team"
  | "Conversion"
  | "Utilization"
  | "Revenue"
  | "Retention";

// Icons are lucide line icons as stand-ins — swap for dedicated assets once
// they're supplied.
const TABS: { name: ReportTabName; icon: typeof TrendingUp }[] = [
  { name: "Sales", icon: TrendingUp },
  { name: "Clients", icon: UsersRound },
  { name: "Team", icon: Users },
  { name: "Conversion", icon: BarChart3 },
  { name: "Utilization", icon: Gauge },
  { name: "Revenue", icon: DollarSign },
  { name: "Retention", icon: Repeat },
];

export default function ReportsTabList({
  activeTab,
  onChange,
}: {
  activeTab: ReportTabName;
  onChange: (tab: ReportTabName) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center self-start rounded-[14px] bg-[#EFF4FA] p-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <ReportTab
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
