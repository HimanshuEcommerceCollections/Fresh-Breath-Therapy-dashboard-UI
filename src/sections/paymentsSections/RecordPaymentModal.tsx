"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import {
  packageOptions,
  type PackageOption,
} from "@/src/data/paymentsData/packageOptions";
import {
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentsData";
import { clientsData } from "@/src/data/clientsData/clientsData";

const PACKAGE_LABELS = packageOptions.map((p) => p.label);

export default function RecordPaymentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [clientId, setClientId] = useState("");
  const [packageLabel, setPackageLabel] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [date, setDate] = useState("25/06/2026");

  if (!open) return null;

  // When a package is selected, auto-fill both amount fields with the
  // package's price as a starting default (still editable).
  function handlePackageChange(label: string) {
    setPackageLabel(label);
    const pkg: PackageOption | undefined = packageOptions.find(
      (p) => p.label === label,
    );
    if (pkg) {
      setAmountDue(String(pkg.price));
      setAmountPaid(String(pkg.price));
    }
  }

  function handleRecord() {
    const due = Number(amountDue) || 0;
    const paid = Number(amountPaid) || 0;
    const status: PaymentStatus =
      paid >= due && due > 0 ? "Paid" : paid > 0 ? "Partially Paid" : "Pending";
    const clientName =
      clientsData.find((c) => c.id === clientId)?.name ?? clientId;

    const newPayment = {
      id: crypto.randomUUID(),
      clientName,
      packageName: packageLabel,
      due,
      paid,
      balance: Math.max(0, due - paid),
      date,
      status,
    };
    // TODO: wire into paymentsData state once table is stateful.
    console.log("Record payment:", newPayment);
    onClose();
  }

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
            options={PACKAGE_LABELS}
            value={packageLabel}
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

          {/* 4. Date — full width (Method removed) */}
          <div className="flex flex-col gap-1.5">
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

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={handleRecord}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
          >
            Record
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
