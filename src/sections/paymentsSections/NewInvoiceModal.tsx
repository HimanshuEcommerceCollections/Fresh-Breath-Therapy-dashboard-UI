"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import { usePackages } from "@/src/hooks/usePackages";

// Assigns a package to a client without taking money — the invoice lands at
// Due = full price, Paid = 0, i.e. "Pending". Without this there'd be no way
// for an unpaid invoice to appear at all: an enrollment would only ever come
// into being on its first payment.
export default function NewInvoiceModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (clientId: string, packageId: string) => Promise<unknown>;
}) {
  const { packages } = usePackages();
  const [clientId, setClientId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const selected = packages.find((p) => p.id === packageId) ?? null;
  const canSubmit = Boolean(clientId && packageId) && !isSubmitting;

  function reset() {
    setClientId("");
    setPackageId("");
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onCreate(clientId, packageId);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-[460px] min-w-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E5EB] px-5 py-4">
          <div className="flex min-w-0 flex-col">
            <h2 className="text-lg font-semibold tracking-[-0.36px] text-[#071123]">
              New Invoice
            </h2>
            <p className="text-xs text-[#596475]">
              Assign a package to a client. It starts unpaid, as Pending.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-lg p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-w-0 flex-col gap-4 overflow-y-auto px-5 py-4">
          <ClientSelect label="Client" value={clientId} onChange={setClientId} />

          <FormSelect
            label="Package"
            placeholder="Select a package"
            value={selected?.name ?? ""}
            options={packages.map((p) => p.name)}
            onChange={(name) => {
              const pkg = packages.find((p) => p.name === name);
              setPackageId(pkg?.id ?? "");
            }}
          />

          {selected && (
            <div className="flex flex-col gap-1 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#596475]">Amount due</span>
                <span className="font-semibold text-[#071123]">
                  ${selected.price.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#596475]">Paid so far</span>
                <span className="font-medium text-[#071123]">$0</span>
              </div>
              <p className="pt-1 text-xs text-[#94A3B8]">
                Record payments against this invoice to move it to Partially
                Paid, then Paid.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E0E5EB] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 cursor-pointer rounded-xl border border-[#E0E5EB] bg-white px-4 text-sm font-medium text-[#071123] transition-colors hover:bg-[#F7FBFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="h-9 cursor-pointer rounded-xl bg-[#376EF4] px-4 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating…" : "Create Invoice"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
