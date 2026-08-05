"use client";

import type { Payment } from "@/src/services/paymentsService";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";

const STATUS_STYLES: Record<Payment["enrollment"]["status"], string> = {
  active: "border-[#BFDBFE] bg-[#EFF6FF] text-[#376EF4]",
  completed: "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]",
};
const STATUS_LABELS: Record<Payment["enrollment"]["status"], string> = {
  active: "Active",
  completed: "Completed",
};

export default function PaymentsTableRow({ payment }: { payment: Payment }) {
  return (
    <div
      className={`${PAYMENTS_TABLE_GRID} min-h-[50px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="truncate px-2 py-3 text-sm font-medium leading-5 text-[#071123]">
        {payment.client}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.packageName}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        ${payment.amountPaid.toLocaleString()}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        ${payment.balanceAfter.toLocaleString()}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.method}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.date}
      </div>
      <div className="px-2 py-2">
        <span
          className={`inline-flex h-8 items-center rounded-xl border px-3 text-sm font-normal ${STATUS_STYLES[payment.enrollment.status]}`}
        >
          {STATUS_LABELS[payment.enrollment.status]}
        </span>
      </div>
    </div>
  );
}
