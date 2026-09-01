// The payment vocabulary, mirroring PaymentMethod / PaymentStatus in
// fbtbackend/app/models/enums.py. Single source of truth for both, in the
// same spirit as data/leadsData/contactStatus.ts.
//
// Method is WHO IS COVERING IT, not which instrument was used — the old
// card/ACH/cash/insurance list described the instrument, which nothing ever
// read. Status is stored on the row now, not derived from a package balance.

export const PAYMENT_METHOD_VALUES = ["copay", "self_pay", "insurance"] as const;
export const PAYMENT_STATUS_VALUES = ["paid", "pending", "cancelled"] as const;

export type ApiPaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number];
export type ApiPaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];

export const METHOD_TO_LABEL = {
  copay: "Copay",
  self_pay: "Self-Pay",
  insurance: "Insurance",
} as const satisfies Record<ApiPaymentMethod, string>;

export const STATUS_TO_LABEL = {
  paid: "Paid",
  pending: "Pending",
  cancelled: "Cancelled",
} as const satisfies Record<ApiPaymentStatus, string>;

export type PaymentMethod = (typeof METHOD_TO_LABEL)[ApiPaymentMethod];
export type PaymentStatus = (typeof STATUS_TO_LABEL)[ApiPaymentStatus];

export const LABEL_TO_METHOD = Object.fromEntries(
  Object.entries(METHOD_TO_LABEL).map(([v, l]) => [l, v]),
) as Record<PaymentMethod, ApiPaymentMethod>;

export const LABEL_TO_STATUS = Object.fromEntries(
  Object.entries(STATUS_TO_LABEL).map(([v, l]) => [l, v]),
) as Record<PaymentStatus, ApiPaymentStatus>;

export const paymentMethodOptions: PaymentMethod[] =
  PAYMENT_METHOD_VALUES.map((v) => METHOD_TO_LABEL[v]);
export const paymentStatusOptions: PaymentStatus[] =
  PAYMENT_STATUS_VALUES.map((v) => STATUS_TO_LABEL[v]);

// Green for money in, blue for money expected, slate for money written off.
// Cancelled is deliberately NOT red: it is a normal outcome, not a failure,
// and it counts toward neither collected nor outstanding revenue.
export const paymentStatusColors: Record<
  ApiPaymentStatus,
  { bg: string; border: string; text: string; dot: string }
> = {
  paid: {
    bg: "rgba(22, 163, 74, 0.12)",
    border: "rgba(22, 163, 74, 0.3)",
    text: "#15803D",
    dot: "bg-[#16A34A]",
  },
  pending: {
    bg: "rgba(55, 110, 244, 0.12)",
    border: "rgba(55, 110, 244, 0.3)",
    text: "#1447E6",
    dot: "bg-[#376EF4]",
  },
  cancelled: {
    bg: "rgba(100, 116, 139, 0.12)",
    border: "rgba(100, 116, 139, 0.3)",
    text: "#475569",
    dot: "bg-[#64748B]",
  },
};

/** Counts toward "Collected". Mirrors COLLECTED_STATUSES in enums.py. */
export const isCollected = (s: ApiPaymentStatus) => s === "paid";
/** Counts toward "Outstanding". Mirrors OUTSTANDING_STATUSES in enums.py. */
export const isOutstanding = (s: ApiPaymentStatus) => s === "pending";
