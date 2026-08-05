"use client";

import { useState } from "react";
import { Plus, FilePlus2 } from "lucide-react";
import RecordPaymentModal from "@/src/sections/paymentsSections/RecordPaymentModal";
import NewInvoiceModal from "@/src/sections/paymentsSections/NewInvoiceModal";
import ExportButtons from "@/src/sections/reportsSections/ExportButtons";
import type { CreatePaymentPayload, CreatePaymentResult } from "@/src/services/paymentsService";
import type { PaymentStatus } from "@/src/services/enrollmentsService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { canWrite } from "@/src/lib/permissions";

export default function PaymentsPageHeader({
  onCreate,
  onCreateInvoice,
  statusFilter,
}: {
  onCreate: (payload: CreatePaymentPayload) => Promise<CreatePaymentResult>;
  onCreateInvoice: (clientId: string, packageId: string) => Promise<unknown>;
  statusFilter: PaymentStatus | null;
}) {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const { role } = useCurrentUser();

  return (
    <div className="flex flex-row items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Payments
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          Invoicing, packages and revenue tracking
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Exports respect the active status filter, so the file matches the
            table the user is looking at. */}
        <ExportButtons
          path="/api/exports/payments"
          params={{ payment_status: statusFilter ?? undefined }}
          baseName="fbt-payments"
        />

        {canWrite(role) && (
          <>
            <button
              type="button"
              onClick={() => setIsInvoiceOpen(true)}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-[#E0E5EB] bg-white px-4 text-sm font-medium text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F7FBFD]"
            >
              <FilePlus2 size={16} stroke="#071123" />
              New Invoice
            </button>
            <button
              type="button"
              onClick={() => setIsPaymentOpen(true)}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-[#376EF4] px-4 text-sm font-medium text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
            >
              <Plus size={16} stroke="#FCFCFC" />
              Record Payment
            </button>
          </>
        )}
      </div>

      <RecordPaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onCreate={onCreate}
      />
      <NewInvoiceModal
        open={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        onCreate={onCreateInvoice}
      />
    </div>
  );
}
