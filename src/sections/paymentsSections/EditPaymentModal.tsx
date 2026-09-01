"use client";

// Every field on a payment is editable here.
//
// The old ledger row was immutable except for its method, because amount and
// date fed an enrollment's running balance that would silently go wrong if
// either changed. There is no running balance now, so a mistyped amount is
// safe to correct — and it had otherwise been permanent.

import { useState } from "react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import type { Payment, UpdatePaymentPayload } from "@/src/services/paymentsService";
import {
  paymentMethodOptions,
  paymentStatusOptions,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";

export default function EditPaymentModal({
  payment,
  onClose,
  onSave,
}: {
  payment: Payment;
  onClose: () => void;
  onSave: (paymentId: string, payload: UpdatePaymentPayload) => Promise<Payment>;
}) {
  const [amount, setAmount] = useState(String(payment.amount));
  const [method, setMethod] = useState<PaymentMethod>(payment.method);
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [date, setDate] = useState(payment.date);
  const [isSaving, setIsSaving] = useState(false);

  // Mirrors the API's `gt=0`: a payment for nothing is a data-entry slip, and
  // a zero-amount pending row would sit in Outstanding contributing nothing.
  const numericAmount = Number(amount);
  const isAmountValid = amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount > 0;
  const isValid = isAmountValid && Boolean(date);

  async function handleSave() {
    if (!isValid || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(payment.id, { amount: numericAmount, method, status, date });
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#C3C6D7] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-[#C3C6D7] px-6 py-4">
          <div className="flex flex-col">
            <h2 className="text-[22px] font-bold text-[#0F172A]">Edit Payment</h2>
            <span className="text-sm text-[#596475]">{payment.client}</span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex gap-6">
            <FormField
              label="Amount *"
              type="number"
              min={0.01}
              step={0.01}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={
                amount.trim() !== "" && !isAmountValid
                  ? "Enter an amount greater than 0."
                  : undefined
              }
            />
            <FormField
              label="Date *"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            <FormSelect
              label="Method"
              placeholder="Select method"
              options={paymentMethodOptions}
              value={method}
              onChange={(v) => setMethod(v as PaymentMethod)}
            />
            <FormSelect
              label="Status"
              placeholder="Select status"
              options={paymentStatusOptions}
              value={status}
              onChange={(v) => setStatus(v as PaymentStatus)}
            />
          </div>

          {status === "Cancelled" && (
            <p className="rounded-lg border border-[#E0E5EB] bg-[#F8F9FF] px-4 py-2.5 text-xs leading-4 text-[#596475]">
              Cancelled payments count toward neither collected nor outstanding
              revenue.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 rounded-b-2xl border-t border-[#C3C6D7] bg-[#F8F9FF] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold tracking-[0.6px] text-[#434655] transition-colors hover:bg-black/4"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isValid || isSaving}
            onClick={handleSave}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
