"use client";

import type { Invoice, PaymentStatus } from "@/src/services/enrollmentsService";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import PaymentsTableRow from "@/src/sections/paymentsSections/PaymentsTableRow";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";

const COLUMNS = ["Client", "Package", "Due", "Paid", "Balance", "Started", "Status"];

// `invoices` is always the complete, already-fetched list (optionally
// pre-filtered by status) — there is no further page to load here, so no
// infinite-scroll wiring.
export default function PaymentsTable({
  invoices,
  isLoading,
  canEdit,
  onStatusChange,
}: {
  invoices: Invoice[];
  isLoading: boolean;
  canEdit: boolean;
  onStatusChange: (invoiceId: string, status: PaymentStatus) => void;
}) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${PAYMENTS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column) => (
          <div
            key={column}
            className="px-2 py-2.5 text-sm font-medium leading-5 text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {isLoading ? (
          <TableSkeleton gridClassName={PAYMENTS_TABLE_GRID} columns={COLUMNS.length} />
        ) : invoices.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#94A3B8]">
            No invoices yet. Use “New Invoice” to assign a package to a client,
            or “Record Payment” to log a payment.
          </div>
        ) : (
          invoices.map((invoice) => (
            <PaymentsTableRow
              key={invoice.id}
              invoice={invoice}
              canEdit={canEdit}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
