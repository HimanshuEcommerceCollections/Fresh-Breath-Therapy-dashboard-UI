// A payment ledger row has no status of its own. The four displayed states
// belong to the INVOICE (Enrollment) a payment was applied to: paid /
// partially paid / pending are derived from the money, overdue is an
// admin-set flag. See app/models/enrollment.py payment_status.
export type PaymentStatusSlice = {
  status: string;
  value: number;
  color: string;
};

// Placeholder shape only — every render path fetches this from the backend
// (GET /api/dashboard, GET /api/enrollments).
export const paymentStatusData: PaymentStatusSlice[] = [
  { status: "Paid", value: 0, color: "#16A34A" },
  { status: "Partially Paid", value: 0, color: "#F2A618" },
  { status: "Pending", value: 0, color: "#376EF4" },
  { status: "Overdue", value: 0, color: "#EF4444" },
];
