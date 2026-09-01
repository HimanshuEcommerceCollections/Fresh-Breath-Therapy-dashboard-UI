"use client";

import type { Payment } from "@/src/services/paymentsService";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import PaymentStatusBadge from "@/src/sections/paymentsSections/PaymentStatusBadge";
import StatusCombobox from "@/src/sections/leadsSections/StatusCombobox";
import { paymentStatusOptions, type PaymentStatus } from "@/src/data/paymentsData/paymentVocabulary";

function money(v: number) {
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PaymentsTableRow({
  payment,
  canEdit,
  onStatusChange,
  onEdit,
}: {
  payment: Payment;
  canEdit: boolean;
  onStatusChange: (paymentId: string, status: PaymentStatus) => void;
  onEdit: (payment: Payment) => void;
}) {
  return (
    <div
      className={`${PAYMENTS_TABLE_GRID} min-h-[52px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      {/* The lead badge matters here: an admin scanning payments needs to
          know which of these people is not a client yet. */}
      <div className="flex min-w-0 items-center gap-2 px-2 py-3">
        <span className="truncate text-sm font-medium leading-5 text-[#071123]">
          {payment.subject.name}
        </span>
        {payment.subject.kind === "lead" && (
          <span className="shrink-0 rounded-full bg-[#E8EDF4] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-[#596475]">
            Lead
          </span>
        )}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {money(payment.amount)}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 text-[#071123]">
        {payment.method}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 text-[#596475]">
        {payment.date}
      </div>

      {/* The one-click Pending -> Paid the search box exists to serve: find
          the patient, flip the status, done. Read-only roles get a badge. */}
      <div className="px-2 py-2">
        {canEdit ? (
          <StatusCombobox
            key={payment.status}
            status={payment.status}
            options={paymentStatusOptions}
            widthClass="w-36"
            onSelect={(next) => onStatusChange(payment.id, next as PaymentStatus)}
          />
        ) : (
          <PaymentStatusBadge status={payment.status} />
        )}
      </div>

      <div className="flex items-center justify-end px-2 py-2.5">
        {canEdit && (
          <button
            type="button"
            aria-label={`Edit payment for ${payment.subject.name}`}
            onClick={() => onEdit(payment)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#071123] transition-colors hover:bg-black/4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.6171 1.68605 13.825 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38301 14.4088 2.6118C14.5035 2.84059 14.5523 3.08582 14.5523 3.33337C14.5523 3.58093 14.5035 3.82616 14.4088 4.05495C14.314 4.28374 14.1751 4.49161 14 4.66671L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00004Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
