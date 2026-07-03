export type PaymentStatus = "Paid" | "Partially Paid" | "Pending" | "Overdue";
export type PaymentMethod = "Credit Card" | "ACH" | "Cash" | "Insurance";

export type Payment = {
  id: string;
  clientName: string;
  packageName: string; // "4 Sessions Starter — $480"
  due: number;
  paid: number;
  balance: number;
  method: PaymentMethod;
  date: string; // "2026-06-25"
  status: PaymentStatus;
};

// TODO: replace with backend-fetched payments (/api/payments).
// Rows 1–2 are exact from the spec. Rows 3–16 are PLACEHOLDERS pending exact
// transcription from the reference screenshot — paid amounts follow each
// client's lifetimeValue in clientsData (which rows 1–2 match), with the
// package chosen to fit; methods/dates/statuses are plausible fills.
export const paymentsData: Payment[] = [
  { id: "1", clientName: "Lucas Taylor", packageName: "4 Sessions Starter — $480", due: 480, paid: 240, balance: 240, method: "Credit Card", date: "2026-06-25", status: "Partially Paid" },
  { id: "2", clientName: "William Foster", packageName: "8 Sessions Plus — $880", due: 880, paid: 440, balance: 440, method: "ACH", date: "2026-06-22", status: "Partially Paid" },
  { id: "3", clientName: "Ethan Quinn", packageName: "12 Sessions Pro — $1,260", due: 1260, paid: 630, balance: 630, method: "Cash", date: "2026-06-24", status: "Partially Paid" },
  { id: "4", clientName: "Mia Foster", packageName: "Single Session — $130", due: 130, paid: 65, balance: 65, method: "Insurance", date: "2026-06-21", status: "Partially Paid" },
  { id: "5", clientName: "Wyatt Owens", packageName: "4 Sessions Starter — $480", due: 480, paid: 240, balance: 240, method: "Credit Card", date: "2026-06-20", status: "Partially Paid" },
  { id: "6", clientName: "Scarlett Carter", packageName: "4 Sessions Starter — $480", due: 480, paid: 0, balance: 480, method: "ACH", date: "2026-06-18", status: "Overdue" },
  { id: "7", clientName: "Elizabeth Owens", packageName: "12 Sessions Pro — $1,260", due: 1260, paid: 1260, balance: 0, method: "Credit Card", date: "2026-06-17", status: "Paid" },
  { id: "8", clientName: "Mia Brown", packageName: "Single Session — $130", due: 130, paid: 65, balance: 65, method: "Cash", date: "2026-06-16", status: "Partially Paid" },
  { id: "9", clientName: "Olivia Young", packageName: "4 Sessions Starter — $480", due: 480, paid: 240, balance: 240, method: "Insurance", date: "2026-06-15", status: "Partially Paid" },
  { id: "10", clientName: "Isabella Smith", packageName: "8 Sessions Plus — $880", due: 880, paid: 0, balance: 880, method: "ACH", date: "2026-06-14", status: "Pending" },
  { id: "11", clientName: "Sophia Parker", packageName: "12 Sessions Pro — $1,260", due: 1260, paid: 630, balance: 630, method: "Credit Card", date: "2026-06-12", status: "Partially Paid" },
  { id: "12", clientName: "Jackson Owens", packageName: "Single Session — $130", due: 130, paid: 65, balance: 65, method: "Cash", date: "2026-06-11", status: "Partially Paid" },
  { id: "13", clientName: "Amelia Carter", packageName: "4 Sessions Starter — $480", due: 480, paid: 0, balance: 480, method: "Insurance", date: "2026-06-10", status: "Pending" },
  { id: "14", clientName: "Elizabeth Harris", packageName: "8 Sessions Plus — $880", due: 880, paid: 880, balance: 0, method: "Credit Card", date: "2026-06-09", status: "Paid" },
  { id: "15", clientName: "Isabella Walker", packageName: "12 Sessions Pro — $1,260", due: 1260, paid: 630, balance: 630, method: "ACH", date: "2026-06-08", status: "Partially Paid" },
  { id: "16", clientName: "Isabella Smith", packageName: "Single Session — $130", due: 130, paid: 0, balance: 130, method: "Cash", date: "2026-06-07", status: "Overdue" },
];

export const paymentStatusOptions: PaymentStatus[] = [
  "Paid",
  "Partially Paid",
  "Pending",
  "Overdue",
];
