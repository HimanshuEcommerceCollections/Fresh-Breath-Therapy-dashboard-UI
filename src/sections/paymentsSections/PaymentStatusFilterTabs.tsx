"use client";

import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_ORDER,
  type PaymentStatus,
} from "@/src/services/enrollmentsService";

const DOTS: Record<PaymentStatus, string> = {
  paid: "bg-[#16A34A]",
  partially_paid: "bg-[#F2A618]",
  pending: "bg-[#376EF4]",
  overdue: "bg-[#EF4444]",
};

// Filtering happens server-side (the derived statuses are computed in SQL), so
// switching a tab refetches page 1 rather than filtering an already-loaded and
// possibly partial list.
export default function PaymentStatusFilterTabs({
  active,
  onChange,
}: {
  active: PaymentStatus | null;
  onChange: (next: PaymentStatus | null) => void;
}) {
  const base =
    "flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${base} ${
          active === null
            ? "border-[#376EF4] bg-[#376EF4] text-white"
            : "border-[#E0E5EB] bg-white text-[#071123] hover:bg-[#F7FBFD]"
        }`}
      >
        All
      </button>
      {PAYMENT_STATUS_ORDER.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(active === status ? null : status)}
          className={`${base} ${
            active === status
              ? "border-[#376EF4] bg-[#376EF4] text-white"
              : "border-[#E0E5EB] bg-white text-[#071123] hover:bg-[#F7FBFD]"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} />
          {PAYMENT_STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
