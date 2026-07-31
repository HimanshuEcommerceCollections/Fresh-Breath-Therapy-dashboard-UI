"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";
import type { PackagePayload, ServicePackage } from "@/src/services/packagesService";

export default function PackageFormModal({
  open,
  onClose,
  onSubmit,
  editingPackage,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PackagePayload) => Promise<void>;
  editingPackage: ServicePackage | null;
  isSaving: boolean;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(editingPackage?.name ?? "");
    setPrice(editingPackage ? String(editingPackage.price) : "");
    setIsActive(editingPackage?.isActive ?? true);
  }, [open, editingPackage]);

  if (!open) return null;

  const isValid = name.trim().length > 0 && Number(price) > 0;

  async function handleSubmit() {
    if (!isValid) return;
    await onSubmit({ name: name.trim(), price: Number(price), isActive });
    onClose();
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[420px] flex-col rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {editingPackage ? "Edit Package" : "Add Package"}
          </h2>
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
          <FormField
            label="Package Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 4 Sessions Starter"
          />
          <FormField
            label="Price ($)"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
          />
          <ToggleRow label="Active" enabled={isActive} onToggle={() => setIsActive((v) => !v)} />
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!isValid || isSaving}
            onClick={handleSubmit}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSaving ? "Saving…" : editingPackage ? "Save Changes" : "Add Package"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
