"use client";

import { AlertTriangle, Info } from "lucide-react";
import ImportStatusBadge from "@/src/sections/importsSections/ImportStatusBadge";
import SearchableSelect from "@/src/components/sharedComponents/SearchableSelect";
import ValueMappingPanel from "@/src/sections/importsSections/ValueMappingPanel";
import {
  MATCH_REASON_COLORS,
  MATCH_REASON_LABELS,
  WRITABILITY_NOTES,
} from "@/src/data/importsData/importsData";
import type {
  ImportField,
  ValueMapping,
} from "@/src/services/importsService";

/**
 * One source column, where it's going, and how much to trust that.
 *
 * `parseRate` is the honest signal here. A column headed "Ph" mapped to
 * `email` scores 0% because none of its sampled values parse as an address —
 * so the row says so, rather than presenting a confident-looking guess the
 * data contradicts.
 */
export default function MappingColumnRow({
  header,
  field,
  reason,
  parseRate,
  samples,
  warning,
  availableFields,
  valueMapping,
  onFieldChange,
  onValueMappingChange,
}: {
  header: string;
  field: string | null;
  reason: string;
  parseRate: number | null;
  samples: string[];
  warning: string | null;
  availableFields: ImportField[];
  valueMapping: ValueMapping | null;
  onFieldChange: (field: string | null) => void;
  onValueMappingChange: (sourceValue: string, canonical: string | null) => void;
}) {
  const selected = availableFields.find((f) => f.name === field) ?? null;
  const reasonColors = MATCH_REASON_COLORS[reason] ?? MATCH_REASON_COLORS.none;
  const writabilityNote = selected ? WRITABILITY_NOTES[selected.writable] : null;
  const lowParseRate = parseRate !== null && parseRate < 0.9;

  return (
    <div className="border-b border-[#E0E5EB] px-5 py-4 last:border-b-0">
      <div className="grid grid-cols-[1fr_28px_240px_120px] items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#071123]" title={header}>
            {header}
          </p>
          {samples.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-[#94A3B8]" title={samples.join(" · ")}>
              {samples.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>

        <span className="text-center text-[#94A3B8]">→</span>

        <SearchableSelect
          value={field ?? ""}
          options={availableFields.map((f) => ({
            id: f.name,
            label: f.required ? `${f.label} (required)` : f.label,
            hint: f.helpText ?? undefined,
          }))}
          onChange={(name) => onFieldChange(name || null)}
          placeholder="Don't import this column"
          emptyOptionLabel="Don't import this column"
          searchPlaceholder="Search fields…"
        />

        <div className="flex items-center justify-end gap-2">
          {parseRate !== null && (
            <span
              className={`text-xs font-medium ${
                lowParseRate ? "text-[#B91C1C]" : "text-[#15803D]"
              }`}
              title="How many sampled values look valid for this field"
            >
              {Math.round(parseRate * 100)}% valid
            </span>
          )}
          {field && (
            <ImportStatusBadge
              label={MATCH_REASON_LABELS[reason] ?? reason}
              bg={reasonColors.bg}
              text={reasonColors.text}
            />
          )}
        </div>
      </div>

      {warning && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#9A611D]">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          {warning}
        </p>
      )}

      {selected?.helpText && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#596475]">
          <Info size={13} className="mt-0.5 shrink-0" />
          {selected.helpText}
        </p>
      )}

      {writabilityNote && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[#596475]">
          <Info size={13} className="mt-0.5 shrink-0" />
          {writabilityNote}
        </p>
      )}

      {valueMapping && (
        <ValueMappingPanel mapping={valueMapping} onChange={onValueMappingChange} />
      )}
    </div>
  );
}
