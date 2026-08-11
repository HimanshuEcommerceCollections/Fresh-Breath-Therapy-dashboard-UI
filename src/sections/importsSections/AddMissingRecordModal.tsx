"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import LocationSelect from "@/src/components/sharedComponents/LocationSelect";
import type { FkGroup, ImportEntity } from "@/src/services/importsService";

/**
 * Create a record the sheet references but the dashboard doesn't have.
 *
 * The form is generated from the TARGET entity's own field list, so it always
 * asks for exactly what that table requires and nothing more — no second
 * hand-maintained copy of "what a client needs" to drift out of step with
 * the registry.
 *
 * The name is pre-filled from the sheet and left editable: the sheet is often
 * where the typo is, and this is the moment to fix it.
 */
export default function AddMissingRecordModal({
  group,
  target,
  isSaving,
  onClose,
  onSubmit,
}: {
  group: FkGroup;
  target: ImportEntity;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
}) {
  // Only what the target actually requires — an inline create is meant to
  // unblock the import, not be a full record editor.
  const fields = target.fields.filter(
    (f) => f.required && f.writable !== "never"
  );

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      // The first text field gets the name as written in the sheet.
      initial[field.name] =
        field.name === "name" ? group.sourceValue : "";
    }
    return initial;
  });

  const set = (name: string, value: string) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  const missing = fields.filter((f) => !values[f.name]?.trim());
  const canSubmit = missing.length === 0 && !isSaving;

  const singular = target.label.replace(/s$/, "");

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-125 rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_10px_30px_rgba(7,17,35,0.12)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E5EB] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.3px] text-[#071123]">
              Add {singular.toLowerCase()}
            </h2>
            <p className="mt-0.5 text-sm text-[#596475]">
              &ldquo;{group.sourceValue}&rdquo; isn&apos;t in the dashboard yet.
              Adding them here resolves {group.rowCount} row
              {group.rowCount === 1 ? "" : "s"}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {fields.map((field) => {
            if (field.kind === "fk" && field.name === "therapist") {
              return (
                <TherapistSelect
                  key={field.name}
                  label={field.label}
                  value={values[field.name] ?? ""}
                  onChange={(id) => set(field.name, id)}
                />
              );
            }
            if (field.kind === "fk" && field.name === "location") {
              return (
                <LocationSelect
                  key={field.name}
                  label={field.label}
                  value={values[field.name] ?? ""}
                  onChange={(id) => set(field.name, id)}
                />
              );
            }
            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                  {field.label}
                </label>
                <input
                  type={
                    field.kind === "email"
                      ? "email"
                      : field.kind === "money"
                        ? "number"
                        : "text"
                  }
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  placeholder={field.helpText ?? undefined}
                  className="h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] px-3 text-sm text-[#071123] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#376EF4]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E0E5EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E0E5EB] px-4 py-2 text-sm font-medium text-[#071123] transition-colors hover:bg-[#F7FBFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit(values)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Add {singular.toLowerCase()}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
