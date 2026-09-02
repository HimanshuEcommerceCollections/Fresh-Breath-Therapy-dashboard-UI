// A slice of the payment-status donut, shared by the Dashboard and the
// Payments page. Both are fetched from the backend on every render path; the
// array below is a placeholder shape only.
//
// The status is stored on the payment row now. It used to belong to the
// INVOICE (Enrollment) a payment was applied to, with paid/partially paid/
// pending derived from the money and overdue an admin-set flag — none of which
// exists any more. See data/paymentsData/paymentVocabulary.ts.
export type PaymentStatusSlice = {
  status: string;
  value: number;
  color: string;
};

export const paymentStatusData: PaymentStatusSlice[] = [
  { status: "Paid", value: 0, color: "#15803D" },
  { status: "Pending", value: 0, color: "#1447E6" },
  { status: "Cancelled", value: 0, color: "#475569" },
];
