"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import { usePackages } from "@/src/hooks/usePackages";
import { enrollmentsService, type Enrollment } from "@/src/services/enrollmentsService";
import type { CreatePaymentPayload, CreatePaymentResult } from "@/src/services/paymentsService";
import type { PaymentMethod } from "@/src/data/paymentsData/paymentsData";

const METHOD_OPTIONS: PaymentMethod[] = ["Credit Card", "ACH", "Cash", "Insurance"];

export default function RecordPaymentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePaymentPayload) => Promise<CreatePaymentResult>;
}) {
  // Shared cache with Settings > Packages (same ["packages"] query key) — a
  // package created/edited there invalidates this too, so it's never stale
  // here regardless of whether this modal happened to be open at the time.
  const { packages } = usePackages();
  const [clientId, setClientId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Credit Card");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-derived from the backend the moment both Client and Package are
  // picked — the admin never types "amount due" or "paid so far" anywhere.
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null);
  const [hasPriorHistory, setHasPriorHistory] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  useEffect(() => {
    if (!clientId || !packageId) {
      setActiveEnrollment(null);
      setHasPriorHistory(false);
      return;
    }
    let cancelled = false;
    setIsLookingUp(true);
    Promise.all([
      enrollmentsService.lookupActive(clientId, packageId),
      enrollmentsService.fetchHistory(clientId, packageId),
    ])
      .then(([active, history]) => {
        if (cancelled) return;
        setActiveEnrollment(active);
        setHasPriorHistory(history.length > 0);
      })
      .finally(() => {
        if (!cancelled) setIsLookingUp(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, packageId]);

  if (!open) return null;

  const selectedPackage = packages.find((p) => p.id === packageId) ?? null;
  const packagePrice = selectedPackage?.price ?? 0;
  const totalPaidSoFar = activeEnrollment?.totalPaid ?? 0;
  const amountDue = activeEnrollment?.amountDue ?? packagePrice;
  // "Prior history but no active enrollment" means the last cycle for this
  // client+package already completed — this payment starts a brand-new one.
  const isStartingNewCycle = Boolean(clientId && packageId && !isLookingUp && !activeEnrollment && hasPriorHistory);

  function handlePackageChange(name: string) {
    const pkg = packages.find((p) => p.name === name);
    setPackageId(pkg?.id ?? "");
  }

  async function handleRecord() {
    const paidNow = Number(amountPaid) || 0;
    if (!clientId || !packageId || !date || paidNow <= 0) return;

    setIsSubmitting(true);
    try {
      await onCreate({ clientId, packageId, amountPaid: paidNow, method, date });
      onClose();
      setClientId("");
      setPackageId("");
      setAmountPaid("");
      setDate("");
      setActiveEnrollment(null);
      setHasPriorHistory(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPackageName = selectedPackage?.name ?? "";
  const isFormValid = Boolean(clientId) && Boolean(packageId) && Boolean(date) && Number(amountPaid) > 0;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[460px] flex-col rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-xl font-bold text-[#0F172A]">Record payment</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* 1. Client — shared combobox */}
          <ClientSelect
            label="Client"
            value={clientId}
            onChange={setClientId}
            labelClassName="text-xs font-semibold tracking-[0.6px] text-[#434655]"
            shellClassName="h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] focus:ring-2 focus:ring-[#325A5E]/30"
          />

          {/* 2. Package */}
          <FormSelect
            label="Package"
            placeholder="Select package"
            options={packages.map((p) => p.name)}
            value={selectedPackageName}
            onChange={handlePackageChange}
          />

          {/* 3. Auto-derived payment-cycle context — never typed by the admin */}
          {clientId && packageId && (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm">
              {isLookingUp ? (
                <span className="text-[#94A3B8]">Checking payment history…</span>
              ) : isStartingNewCycle ? (
                <span className="font-medium text-[#376EF4]">
                  Starting new payment cycle — the previous package was fully paid off.
                </span>
              ) : (
                <span className="text-[#434655]">
                  Paid so far:{" "}
                  <span className="font-semibold text-[#0B1C30]">
                    ${totalPaidSoFar.toLocaleString()}
                  </span>{" "}
                  of ${packagePrice.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* 4. Amount Paid (this installment) + Amount Due (read-only) */}
          <div className="flex gap-4">
            <FormField
              label="Amount Paid (this installment)"
              type="number"
              min={0}
              placeholder="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                Amount Due
              </span>
              <div
                title="Calculated automatically — not editable"
                className="flex h-10 w-full items-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] px-4 text-base text-[#596475]"
              >
                ${amountDue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 5. Method + Date */}
          <div className="flex gap-4">
            <FormSelect
              label="Method"
              placeholder="Select method"
              options={METHOD_OPTIONS}
              value={method}
              onChange={(value) => setMethod(value as PaymentMethod)}
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] px-4 text-base text-[#0B1C30] outline-none focus:ring-2 focus:ring-[#325A5E]/30"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!isFormValid || isSubmitting}
            onClick={handleRecord}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSubmitting ? "Recording…" : "Record"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
