"use client";

import type { Invoice, PaymentStatus } from "@/src/services/enrollmentsService";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import PaymentStatusSelect from "@/src/sections/paymentsSections/PaymentStatusSelect";

function money(v: number) {
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function PaymentsTableRow({
  invoice,
  canEdit,
  onStatusChange,
}: {
  invoice: Invoice;
  canEdit: boolean;
  onStatusChange: (invoiceId: string, status: PaymentStatus) => void;
}) {
  return (
    <div
      className={`${PAYMENTS_TABLE_GRID} min-h-[52px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="truncate px-2 py-3 text-sm font-medium leading-5 text-[#071123]">
        {invoice.clientName}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {invoice.packageName}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {money(invoice.packagePriceSnapshot)}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {money(invoice.totalPaid)}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {money(invoice.amountDue)}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#596475]">
        {invoice.startedAt.slice(0, 10)}
      </div>
      <div className="px-2 py-2">
        <PaymentStatusSelect
          status={invoice.paymentStatus}
          readOnly={!canEdit}
          onSelect={(next) => onStatusChange(invoice.id, next)}
        />
      </div>
    </div>
  );
}
