import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

export type { PaymentStatusSlice };

// Same shape as the Dashboard's paymentStatusData (type reused above).
// TODO: replace with backend-fetched invoice status breakdown.
export const statusDistributionData: PaymentStatusSlice[] = [
  { status: "Paid", value: 20, color: "#3FC168" },
  { status: "Partially Paid", value: 50, color: "#F2A618" },
  { status: "Pending", value: 15, color: "#376EF4" },
  { status: "Overdue", value: 15, color: "#F22A36" },
];
