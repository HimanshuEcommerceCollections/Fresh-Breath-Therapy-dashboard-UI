"use client";

import type { Payment } from "@/src/data/paymentsData/paymentsData";
import { paymentStatusOptions } from "@/src/data/paymentsData/paymentsData";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import StatusCombobox from "@/src/sections/leadsSections/StatusCombobox";

export default function PaymentsTableRow({ payment }: { payment: Payment }) {
  return (
    <div
      className={`${PAYMENTS_TABLE_GRID} min-h-[50px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="truncate px-2 py-3 text-sm font-medium leading-5 text-[#071123]">
        {payment.clientName}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.packageName}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        ${payment.due.toLocaleString()}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        ${payment.paid.toLocaleString()}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        ${payment.balance.toLocaleString()}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.method}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.date}
      </div>
      <div className="px-2 py-2">
        <StatusCombobox
          status={payment.status}
          options={paymentStatusOptions}
          widthClass="w-35"
        />
      </div>
    </div>
  );
}
