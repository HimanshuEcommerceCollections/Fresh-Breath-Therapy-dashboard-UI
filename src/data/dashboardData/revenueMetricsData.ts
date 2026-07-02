import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";

const ICON_BASE = "/dashboard/dashboardicons/revenueicons";

const BLUE = { iconColor: "#376EF4", iconBgColor: "rgba(55,110,244,0.1)" };
const GREEN = { iconColor: "#3FC168", iconBgColor: "rgba(63,193,104,0.1)" };
const ORANGE = { iconColor: "#F2A618", iconBgColor: "rgba(242,166,24,0.1)" };

export const revenueMetricsStats: StatCardData[] = [
  {
    label: "Total Revenue",
    value: "$5,515",
    iconSrc: `${ICON_BASE}/totalrevenue.svg`,
    ...GREEN,
  },
  {
    label: "Monthly Revenue",
    value: "$3,180",
    iconSrc: `${ICON_BASE}/monthlyrevenue.svg`,
    ...BLUE,
  },
  {
    label: "Pending Payments",
    value: "$5,485",
    iconSrc: `${ICON_BASE}/pendingpayments.svg`,
    ...ORANGE,
  },
  {
    label: "Collected",
    value: "$5,515",
    iconSrc: `${ICON_BASE}/collected.svg`,
    ...GREEN,
  },
  {
    label: "Avg / Client",
    value: "$919",
    iconSrc: `${ICON_BASE}/avgclients.svg`,
    ...BLUE,
  },
];
