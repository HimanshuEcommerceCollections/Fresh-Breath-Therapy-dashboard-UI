"use client";

import ExportButtons from "@/src/sections/reportsSections/ExportButtons";
import {
  LABEL_TO_METHOD,
  LABEL_TO_STATUS,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";

// No create actions. A payment is recorded when a session is scheduled — one
// cannot exist without a session to be for — so "Record Payment" and "New
// Invoice" are gone from this page entirely.
export default function PaymentsPageHeader({
  statusFilter,
  methodFilter,
}: {
  statusFilter: PaymentStatus | null;
  methodFilter: PaymentMethod | null;
}) {
  return (
    <div className="flex flex-row items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Payments
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          What each session cost, and whether it has been settled
        </p>
      </div>

      {/* Exports respect the active filters, so the file matches the table
          the user is looking at. */}
      <ExportButtons
        path="/api/exports/payments"
        params={{
          payment_status: statusFilter ? LABEL_TO_STATUS[statusFilter] : undefined,
          method: methodFilter ? LABEL_TO_METHOD[methodFilter] : undefined,
        }}
        baseName="fbt-payments"
      />
    </div>
  );
}
