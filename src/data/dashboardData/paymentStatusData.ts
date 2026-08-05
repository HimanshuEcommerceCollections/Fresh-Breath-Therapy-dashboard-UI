// A payment ledger row has no status of its own — "Paid/Partial/Pending/
// Overdue" used to live per-payment, but now that state belongs to the
// Enrollment the payment was applied to (an enrollment cycle is either
// still being paid off or fully paid), so this distribution is Active vs
// Completed enrollment counts instead of a payment-status breakdown.
export type PaymentStatusSlice = {
  status: string;
  value: number;
  color: string;
};

// TODO: replace with backend-fetched invoice/payment status breakdown.
export const paymentStatusData: PaymentStatusSlice[] = [
  { status: "Active", value: 60, color: "#376EF4" },
  { status: "Completed", value: 40, color: "#3FC168" },
];
