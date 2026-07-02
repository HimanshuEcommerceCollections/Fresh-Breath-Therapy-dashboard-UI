export type PaymentStatusSlice = {
  status: "Paid" | "Partially Paid" | "Pending" | "Overdue";
  value: number;
  color: string;
};

// TODO: replace with backend-fetched invoice/payment status breakdown.
export const paymentStatusData: PaymentStatusSlice[] = [
  { status: "Paid", value: 20, color: "#3FC168" },
  { status: "Partially Paid", value: 55, color: "#F2A618" },
  { status: "Pending", value: 10, color: "#376EF4" },
  { status: "Overdue", value: 15, color: "#F22A36" },
];
