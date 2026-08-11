"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CalendarClock, Loader2 } from "lucide-react";
import MappingColumnRow from "@/src/sections/importsSections/MappingColumnRow";
import { DATE_ORDER_OPTIONS } from "@/src/data/importsData/importsData";
import type {
  ImportBatchDetail,
  ImportEntity,
  ValueMapping,
} from "@/src/services/importsService";

/**
 * Step 1 — confirm where each column goes.
 *
 * Edits are local until "Save and continue", so changing three dropdowns
 * costs one round trip rather than three re-validations. Continue stays
 * disabled while a required field has no column: those are NOT NULL in the
 * database, and letting the admin past here would only produce an error on
 * every row.
 */
export default function MappingStep({
  batch,
  entity,
  isSaving,
  onSave,
}: {
  batch: ImportBatchDetail;
  entity: ImportEntity;
  isSaving: boolean;
  onSave: (payload: {
    columnMapping: Record<string, string | null>;
    valueMapping: Record<string, Record<string, string>>;
    dateOrder: string;
  }) => void;
}) {
  const [columnMapping, setColumnMapping] = useState<Record<string, string | null>>(
    batch.columnMapping
  );
  const [dateOrder, setDateOrder] = useState(batch.dateOrder);
  const [valueMappings, setValueMappings] = useState<ValueMapping[]>(
    batch.valueMappings
  );

  // "never" fields are derived from the payments ledger and can't be written
  // from a sheet — they're excluded here so they never appear as a choice.
  const selectableFields = useMemo(
    () => entity.fields.filter((f) => f.writable !== "never"),
    [entity.fields]
  );

  const unmappedRequired = useMemo(() => {
    const mapped = new Set(Object.values(columnMapping).filter(Boolean));
    return selectableFields.filter((f) => f.required && !mapped.has(f.name));
  }, [columnMapping, selectableFields]);

  const unmappedValues = valueMappings.reduce(
    (total, vm) => total + vm.values.filter((v) => !v.mappedTo).length,
    0
  );

  const hasDateField = selectableFields.some(
    (f) => (f.kind === "date" || f.kind === "time") &&
      Object.values(columnMapping).includes(f.name)
  );

  const handleFieldChange = (header: string, field: string | null) => {
    setColumnMapping((previous) => {
      const next = { ...previous, [header]: field };
      // Two columns can't fill one field — claiming it releases it from
      // whichever column held it before.
      if (field) {
        for (const key of Object.keys(next)) {
          if (key !== header && next[key] === field) next[key] = null;
        }
      }
      return next;
    });
  };

  const handleValueChange = (
    field: string,
    sourceValue: string,
    canonical: string | null
  ) => {
    setValueMappings((previous) =>
      previous.map((vm) =>
        vm.field !== field
          ? vm
          : {
              ...vm,
              values: vm.values.map((v) =>
                v.sourceValue === sourceValue ? { ...v, mappedTo: canonical } : v
              ),
            }
      )
    );
  };

  const handleSave = () => {
    const valueMapping: Record<string, Record<string, string>> = {};
    for (const vm of valueMappings) {
      const entries = vm.values.filter((v) => v.mappedTo);
      if (entries.length === 0) continue;
      valueMapping[vm.field] = Object.fromEntries(
        entries.map((v) => [v.sourceValue, v.mappedTo as string])
      );
    }
    onSave({ columnMapping, valueMapping, dateOrder });
  };

  return (
    <div className="flex flex-col gap-4">
      {unmappedRequired.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#B91C1C]" />
          <div>
            <p className="text-sm font-medium text-[#B91C1C]">
              {unmappedRequired.length} required field
              {unmappedRequired.length === 1 ? "" : "s"} still needs a column
            </p>
            <p className="mt-0.5 text-xs text-[#B91C1C]">
              {unmappedRequired.map((f) => f.label).join(", ")} — a record can&apos;t
              be created without {unmappedRequired.length === 1 ? "it" : "them"}.
            </p>
          </div>
        </div>
      )}

      {!batch.dateOrderConfident && hasDateField && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-4 py-3">
          <CalendarClock size={16} className="shrink-0 text-[#376EF4]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#071123]">
              How are dates written in this sheet?
            </p>
            <p className="text-xs text-[#596475]">
              We couldn&apos;t tell from the data — 03/04/2024 is valid either way.
            </p>
          </div>
          <select
            value={dateOrder}
            onChange={(e) => setDateOrder(e.target.value)}
            className="cursor-pointer rounded-xl border border-[#E0E5EB] bg-white px-3 py-2 text-sm text-[#071123] outline-none focus:border-[#376EF4]"
          >
            {DATE_ORDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} — {option.example}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-[1fr_28px_240px_120px] gap-3 border-b border-[#E0E5EB] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
            Column in your sheet
          </p>
          <span />
          <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
            Goes to
          </p>
          <p className="text-right text-xs font-semibold uppercase tracking-wide text-[#596475]">
            Check
          </p>
        </div>

        {batch.columns.map((column) => {
          const field = columnMapping[column.header] ?? null;
          const takenByOthers = new Set(
            Object.entries(columnMapping)
              .filter(([header, value]) => header !== column.header && value)
              .map(([, value]) => value as string)
          );
          return (
            <MappingColumnRow
              key={column.header}
              header={column.header}
              field={field}
              reason={field === column.field ? column.reason : "none"}
              parseRate={field === column.field ? column.parseRate : null}
              samples={column.samples}
              warning={column.warning}
              availableFields={selectableFields.filter(
                (f) => !takenByOthers.has(f.name)
              )}
              valueMapping={
                valueMappings.find((vm) => vm.field === field) ?? null
              }
              onFieldChange={(next) => handleFieldChange(column.header, next)}
              onValueMappingChange={(sourceValue, canonical) =>
                field && handleValueChange(field, sourceValue, canonical)
              }
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-[#596475]">
          {batch.totalRows.toLocaleString()} rows in {batch.filename}
          {unmappedValues > 0 && (
            <span className="text-[#9A611D]">
              {" "}
              · {unmappedValues} value{unmappedValues === 1 ? "" : "s"} still to answer
            </span>
          )}
        </p>
        <button
          type="button"
          disabled={unmappedRequired.length > 0 || isSaving}
          onClick={handleSave}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          Save and continue
        </button>
      </div>
    </div>
  );
}
