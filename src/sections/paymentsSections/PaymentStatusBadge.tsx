import {
  LABEL_TO_STATUS,
  paymentStatusColors,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";

export default function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const colors = paymentStatusColors[LABEL_TO_STATUS[status]];

  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium leading-4"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {status}
    </span>
  );
}
