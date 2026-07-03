// Single-series bar chart data (distinct from the Dashboard's two-series
// area chart). TODO: replace with backend-fetched monthly revenue.
export type RevenueBarPoint = { month: string; revenue: number };

export const revenueTrendBarData: RevenueBarPoint[] = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 2600 },
  { month: "Jun", revenue: 3180 },
];
