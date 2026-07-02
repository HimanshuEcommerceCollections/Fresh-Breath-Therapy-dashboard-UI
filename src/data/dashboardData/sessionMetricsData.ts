import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";

const ICON_BASE = "/dashboard/dashboardicons/sessionicons";
// "Total Sessions" reuses the same icon as "Sessions Today" in leadClientStatsData.
const LEADS_ICON_BASE = "/dashboard/dashboardicons/leadsicons";

const BLUE = { iconColor: "#376EF4", iconBgColor: "rgba(55,110,244,0.1)" };
const GREEN = { iconColor: "#3FC168", iconBgColor: "rgba(63,193,104,0.1)" };
const ORANGE = { iconColor: "#F2A618", iconBgColor: "rgba(242,166,24,0.1)" };
const RED = { iconColor: "#F22A36", iconBgColor: "rgba(242,42,54,0.1)" };

export const sessionMetricsStats: StatCardData[] = [
  {
    label: "Total Sessions",
    value: 110,
    iconSrc: `${LEADS_ICON_BASE}/sessiontoday.svg`,
    ...BLUE,
  },
  {
    label: "Completed",
    value: 26,
    iconSrc: `${ICON_BASE}/completed.svg`,
    ...GREEN,
  },
  {
    label: "Upcoming",
    value: 58,
    iconSrc: `${ICON_BASE}/upcoming.svg`,
    ...BLUE,
  },
  {
    label: "Missed",
    value: 6,
    iconSrc: `${ICON_BASE}/missed.svg`,
    ...RED,
  },
  {
    label: "Cancelled",
    value: 15,
    iconSrc: `${ICON_BASE}/cancelled.svg`,
    ...ORANGE,
  },
];
