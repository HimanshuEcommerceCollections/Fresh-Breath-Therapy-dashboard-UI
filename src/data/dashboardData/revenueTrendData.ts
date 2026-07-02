export type RevenuePoint = {
  month: string; // "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun"
  collected: number; // blue series
  pending: number; // orange series
};

// TODO: replace with backend-fetched revenue trend data (last 6 months).
export const revenueTrendData: RevenuePoint[] = [
  { month: "Jan", collected: 0, pending: 0 },
  { month: "Feb", collected: 0, pending: 0 },
  { month: "Mar", collected: 0, pending: 0 },
  { month: "Apr", collected: 900, pending: 1400 },
  { month: "May", collected: 2600, pending: 2800 },
  { month: "Jun", collected: 3200, pending: 2800 },
];
