export type PaymentStat = {
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
};

// TODO: replace with backend-fetched revenue stats.
export const paymentsStatsData: PaymentStat[] = [
  { label: "Total Revenue", value: "$5,515", iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" },
  { label: "Monthly Revenue", value: "$3,180", iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)" },
  { label: "Pending Revenue", value: "$5,485", iconColor: "#F2A618", iconBg: "rgba(242,166,24,0.1)" },
  { label: "Collected", value: "$5,515", iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" },
];

// Icons reused from the Dashboard's revenue metrics row (same files).
export const paymentsStatIcons: string[] = [
  "/dashboard/dashboardicons/revenueicons/totalrevenue.svg",
  "/dashboard/dashboardicons/revenueicons/monthlyrevenue.svg",
  "/dashboard/dashboardicons/revenueicons/pendingpayments.svg",
  "/dashboard/dashboardicons/revenueicons/collected.svg",
];
