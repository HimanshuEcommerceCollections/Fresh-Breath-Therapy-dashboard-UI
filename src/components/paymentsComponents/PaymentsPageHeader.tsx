"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import RecordPaymentModal from "@/src/sections/paymentsSections/RecordPaymentModal";
import type { CreatePaymentPayload } from "@/src/services/paymentsService";

export default function PaymentsPageHeader({
  onCreate,
}: {
  onCreate: (payload: CreatePaymentPayload) => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Payments
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          Invoicing, packages and revenue tracking
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-[#376EF4] px-4 text-sm font-medium text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
      >
        <Plus size={16} stroke="#FCFCFC" />
        Record Payment
      </button>

      <RecordPaymentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreate}
      />
    </div>
  );
}
