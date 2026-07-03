// TODO: replace with backend-fetched sales report (/api/reports/sales).
export type SalesPoint = { month: string; sales: number };

export const salesReportData: SalesPoint[] = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 0 },
  { month: "Apr", sales: 900 },
  { month: "May", sales: 2600 },
  { month: "Jun", sales: 3200 },
];
