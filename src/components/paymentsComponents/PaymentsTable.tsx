import type { Payment } from "@/src/services/paymentsService";
import { PAYMENTS_TABLE_GRID } from "@/src/sections/paymentsSections/paymentsTableGrid";
import PaymentsTableRow from "@/src/sections/paymentsSections/PaymentsTableRow";

const COLUMNS = [
  "Client",
  "Package",
  "Due",
  "Paid",
  "Balance",
  "Method",
  "Date",
  "Status",
];

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
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
        {payments.map((payment) => (
          <PaymentsTableRow key={payment.id} payment={payment} />
        ))}
      </div>
    </div>
  );
}
