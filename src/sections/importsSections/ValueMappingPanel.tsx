"use client";

import { AlertTriangle } from "lucide-react";
import SearchableSelect from "@/src/components/sharedComponents/SearchableSelect";
import type { ValueMapping } from "@/src/services/importsService";

/**
 * Maps the wordings in one column to the values the database accepts.
 *
 * Rendered inline beneath its column on the mapping screen, because matching
 * the header is only half the job: "Stage → status" says nothing about what
 * "In Progress" means, and these are closed sets. The suggestions arrive
 * pre-filled from the server; anything it couldn't place is left blank and
 * blocks the import until answered.
 */
export default function ValueMappingPanel({
  mapping,
  onChange,
}: {
  mapping: ValueMapping;
  onChange: (sourceValue: string, canonical: string | null) => void;
}) {
  const unmapped = mapping.values.filter((v) => !v.mappedTo).length;

  return (
    <div className="mt-3 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
          What these values mean
        </p>
        {unmapped > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-[#FFEDD5] px-2.5 py-1 text-xs font-medium text-[#9A611D]">
            <AlertTriangle size={12} />
            {unmapped} to answer
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {mapping.values.map((value) => (
          <div
            key={value.sourceValue}
            className="grid grid-cols-[1fr_auto_170px] items-center gap-2.5"
          >
            <span className="min-w-0 truncate text-sm text-[#071123]" title={value.sourceValue}>
              {value.sourceValue}
            </span>
            <span className="text-xs text-[#94A3B8]">{value.count} rows</span>
            <SearchableSelect
              size="sm"
              invalid
              value={value.mappedTo ?? ""}
              options={mapping.options.map((option) => ({
                id: option,
                label: option.replace(/_/g, " "),
              }))}
              onChange={(next) => onChange(value.sourceValue, next || null)}
              placeholder="Choose…"
              searchPlaceholder="Search values…"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
