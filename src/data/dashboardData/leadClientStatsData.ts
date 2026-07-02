import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";

const ICON_BASE = "/dashboard/dashboardicons/leadsicons";

const BLUE = { iconColor: "#376EF4", iconBgColor: "rgba(55,110,244,0.1)" };
const GREEN = { iconColor: "#3FC168", iconBgColor: "rgba(63,193,104,0.1)" };
const ORANGE = { iconColor: "#F2A618", iconBgColor: "rgba(242,166,24,0.1)" };

export const leadClientStats: StatCardData[] = [
  {
    label: "Total Leads",
    value: 42,
    subtext: "9 new this month",
    iconSrc: `${ICON_BASE}/totalleads.svg`,
    ...BLUE,
  },
  {
    label: "Active Clients",
    value: 6,
    iconSrc: `${ICON_BASE}/activeclients.svg`,
    ...GREEN,
  },
  {
    label: "New Clients",
    value: 9,
    subtext: "Last 30 days",
    iconSrc: `${ICON_BASE}/newclients.svg`,
    ...BLUE,
  },
  {
    label: "Pending Follow-Ups",
    value: 12,
    iconSrc: `${ICON_BASE}/pendingfollowups.svg`,
    ...ORANGE,
  },
  {
    label: "Sessions Today",
    value: 9,
    iconSrc: `${ICON_BASE}/sessiontoday.svg`,
    ...BLUE,
  },
];
