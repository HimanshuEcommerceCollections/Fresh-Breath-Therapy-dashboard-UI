"use client";

import { useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import { packagesService, type ServicePackage } from "@/src/services/packagesService";
import type { CreatePaymentPayload } from "@/src/services/paymentsService";
import type { PaymentMethod, PaymentStatus } from "@/src/data/paymentsData/paymentsData";

const METHOD_OPTIONS: PaymentMethod[] = ["Credit Card", "ACH", "Cash", "Insurance"];

// The date input is free-text DD/MM/YYYY (no date picker exists yet — a
// pre-existing limitation, not introduced here). Converts to the ISO
// "YYYY-MM-DD" the real API expects.
function toIsoDate(ddmmyyyy: string): string | null {
  const match = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export default function RecordPaymentModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreatePaymentPayload) => Promise<void>;
}) {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [clientId, setClientId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Credit Card");
  const [date, setDate] = useState("25/06/2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) packagesService.fetchPackages().then(setPackages).catch(() => {});
  }, [open]);

  if (!open) return null;

  // When a package is selected, auto-fill both amount fields with the
  // package's price as a starting default (still editable).
  function handlePackageChange(name: string) {
    const pkg = packages.find((p) => p.name === name);
    setPackageId(pkg?.id ?? "");
    if (pkg) {
      setAmountDue(String(pkg.price));
      setAmountPaid(String(pkg.price));
    }
  }

  async function handleRecord() {
    const due = Number(amountDue) || 0;
    const paid = Number(amountPaid) || 0;
    const isoDate = toIsoDate(date);
    if (!clientId || !packageId || !isoDate) return;

    const status: PaymentStatus =
      paid >= due && due > 0 ? "Paid" : paid > 0 ? "Partially Paid" : "Pending";

    setIsSubmitting(true);
    try {
      await onCreate({
        clientId,
        packageId,
        due,
        paid,
        method,
        date: isoDate,
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPackageName = packages.find((p) => p.id === packageId)?.name ?? "";

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

          {/* 2. Package — auto-fills Amount Due & Paid on select */}
          <FormSelect
            label="Package"
            placeholder="Select package"
            options={packages.map((p) => p.name)}
            value={selectedPackageName}
            onChange={handlePackageChange}
          />

          {/* 3. Amount Due + Amount Paid */}
          <div className="flex gap-4">
            <FormField
              label="Amount Due"
              type="number"
              placeholder="0"
              value={amountDue}
              onChange={(e) => setAmountDue(e.target.value)}
            />
            <FormField
              label="Amount Paid"
              type="number"
              placeholder="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>

          {/* 4. Method + Date */}
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
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] pl-4 pr-10 text-base text-[#0B1C30] outline-none focus:ring-2 focus:ring-[#325A5E]/30"
                />
                <Calendar
                  size={16}
                  stroke="#434655"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!clientId || !packageId || isSubmitting}
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
