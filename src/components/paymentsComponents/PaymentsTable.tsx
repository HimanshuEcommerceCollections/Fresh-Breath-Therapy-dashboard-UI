"use client";

import type { Payment } from "@/src/services/paymentsService";
import type { PaymentStatus } from "@/src/data/paymentsData/paymentVocabulary";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import PaymentsTableRow from "@/src/sections/paymentsSections/PaymentsTableRow";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";

const COLUMNS = ["Patient", "Amount", "Method", "Date", "Status", ""];

// `payments` is always the complete, already-filtered list — there is no
// further page to load here, so no infinite-scroll wiring.
export default function PaymentsTable({
  payments,
  isLoading,
  canEdit,
  isFiltered,
  onStatusChange,
  onEdit,
}: {
  payments: Payment[];
  isLoading: boolean;
  canEdit: boolean;
  /** Changes the empty state: "no matches" is a different message from
   *  "nothing here yet", and the first one must not read as data loss. */
  isFiltered: boolean;
  onStatusChange: (paymentId: string, status: PaymentStatus) => void;
  onEdit: (payment: Payment) => void;
}) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${PAYMENTS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column, i) => (
          <div
            key={column || `spacer-${i}`}
            className="px-2 py-2.5 text-sm font-medium leading-5 text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {isLoading ? (
          <TableSkeleton gridClassName={PAYMENTS_TABLE_GRID} columns={COLUMNS.length} />
        ) : payments.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#94A3B8]">
            {isFiltered
              ? "No payments match these filters."
              : "No payments yet. A payment is recorded when a session is scheduled."}
          </div>
        ) : (
          payments.map((payment) => (
            <PaymentsTableRow
              key={payment.id}
              payment={payment}
              canEdit={canEdit}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
