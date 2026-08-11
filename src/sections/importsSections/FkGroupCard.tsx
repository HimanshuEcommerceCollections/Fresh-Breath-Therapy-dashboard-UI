"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Plus, Sparkles } from "lucide-react";
import ImportStatusBadge from "@/src/sections/importsSections/ImportStatusBadge";
import SearchableSelect from "@/src/components/sharedComponents/SearchableSelect";
import { fkStatusBadges } from "@/src/data/importsData/importStatusBadges";
import type { FkGroup } from "@/src/services/importsService";

/**
 * One name from the sheet, in one context, and what it should point at.
 *
 * Grouped by name AND by the rows' own context — so five clients naming
 * "Sarah Chen" arrive as "the three at Greensboro" and "the two at Downtown",
 * two correct decisions instead of one that would misfile two patients.
 *
 * Any group can still be expanded to set its rows individually, which is the
 * only way to express the residual case: two therapists of the same name at
 * the same location.
 */
export default function FkGroupCard({
  group,
  selectedId,
  rowSelections,
  onSelect,
  onSelectRow,
  onAddNew,
}: {
  group: FkGroup;
  selectedId: string | null;
  rowSelections: Record<number, string>;
  onSelect: (id: string) => void;
  onSelectRow: (rowNumber: number, id: string) => void;
  onAddNew?: () => void;
}) {
  const badge = fkStatusBadges[group.status] ?? fkStatusBadges.missing;
  const needsInput = group.status === "ambiguous" || group.status === "missing";

  // Open by default when the location couldn't decide. In that case the
  // per-row choice IS the answer — two same-named therapists at one location,
  // or none at it, means the rows genuinely differ and a single group pick
  // would be a guess. The "apply one to all" dropdown stays above as a
  // shortcut for when they really do all belong to the same person.
  const [showRows, setShowRows] = useState(
    needsInput && group.rows.length > 1 && group.candidates.length > 1
  );
  const current = selectedId ?? group.resolvedId;
  const rowsAnswered = group.rows.filter((r) => rowSelections[r.rowNumber]).length;
  const fullyAnsweredPerRow =
    group.rows.length > 0 && rowsAnswered === group.rows.length;
  const settled = Boolean(selectedId) || fullyAnsweredPerRow;

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 ${
        needsInput && !settled
          ? "border-[#F2A618] bg-[#FFFBF3]"
          : "border-[#E0E5EB] bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 text-sm font-medium text-[#071123]">
            <span className="truncate">&ldquo;{group.sourceValue}&rdquo;</span>
            {group.disambiguator && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-xs font-normal text-[#475569]">
                <MapPin size={11} />
                {group.disambiguator}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-[#596475]">
            {group.rowCount} row{group.rowCount === 1 ? "" : "s"}
            {group.message && <> · {group.message}</>}
          </p>
        </div>
        <ImportStatusBadge
          label={
            fullyAnsweredPerRow && !selectedId
              ? "Set per row"
              : settled
                ? "Answered"
                : badge.label
          }
          bg={settled ? "#DCFCE7" : badge.bg}
          text={settled ? "#15803D" : badge.text}
        />
      </div>

      {group.matchedBy && !needsInput && (
        <p className="mt-1.5 text-xs text-[#15803D]">
          Matched by {group.matchedBy} — change it below if that&apos;s wrong.
        </p>
      )}

      {group.status === "missing" && onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#376EF4] bg-[#F5F8FF] px-3 py-2 text-sm font-medium text-[#376EF4] transition-colors hover:bg-[#EBF1FF]"
        >
          <Plus size={15} />
          Add &ldquo;{group.sourceValue}&rdquo; as a new {group.target.replace(/s$/, "")}
        </button>
      )}

      {needsInput && (
        <div className="mt-3 flex flex-col gap-2">
          {group.status === "missing" && (
            <p className="text-xs text-[#596475]">
              …or point these rows at an existing{" "}
              {group.target.replace(/s$/, "")}:
            </p>
          )}
          {group.suggestion && (
            <button
              type="button"
              onClick={() => onSelect(group.suggestion!.id)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                current === group.suggestion.id
                  ? "border-[#376EF4] bg-[#F5F8FF] text-[#071123]"
                  : "border-[#E0E5EB] bg-white text-[#071123] hover:bg-[#F7FBFD]"
              }`}
            >
              <Sparkles size={14} className="shrink-0 text-[#7C3AED]" />
              <span className="min-w-0 truncate">
                Closest match: <strong>{group.suggestion.label}</strong>
              </span>
            </button>
          )}

          <SearchableSelect
            value={current ?? ""}
            options={group.candidates.map((c) => ({ id: c.id, label: c.label }))}
            onChange={(id) => id && onSelect(id)}
            disabled={fullyAnsweredPerRow}
            invalid
            placeholder={
              fullyAnsweredPerRow
                ? "Set individually below"
                : `Apply one to all ${group.rowCount} row${group.rowCount === 1 ? "" : "s"}…`
            }
            searchPlaceholder={`Search ${group.target}…`}
          />
        </div>
      )}

      {group.rows.length > 1 && group.candidates.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setShowRows((v) => !v)}
            className="mt-2.5 flex cursor-pointer items-center gap-1 text-xs font-medium text-[#376EF4] hover:underline"
          >
            <ChevronDown
              size={13}
              className={`transition-transform ${showRows ? "rotate-180" : ""}`}
            />
            {showRows ? "Hide rows" : `Set these ${group.rowCount} rows individually`}
            {rowsAnswered > 0 && !showRows && (
              <span className="text-[#596475]">
                ({rowsAnswered} set individually)
              </span>
            )}
          </button>

          {showRows && (
            <div className="mt-2 flex flex-col gap-1.5 rounded-lg bg-[#F7FBFD] p-2.5">
              <p className="text-xs text-[#596475]">
                Anything set here wins over the choice above.
              </p>
              {group.rows.map((row) => (
                <div
                  key={row.rowNumber}
                  className="grid grid-cols-[52px_1fr_1.4fr] items-center gap-2"
                >
                  <span className="text-xs text-[#94A3B8]">Line {row.rowNumber}</span>
                  <span className="min-w-0 truncate text-sm text-[#071123]">
                    {row.label}
                  </span>
                  <SearchableSelect
                    size="sm"
                    value={rowSelections[row.rowNumber] ?? ""}
                    options={group.candidates.map((c) => ({
                      id: c.id, label: c.label,
                    }))}
                    onChange={(id) => onSelectRow(row.rowNumber, id)}
                    placeholder="Use the choice above"
                    emptyOptionLabel="Use the choice above"
                    searchPlaceholder={`Search ${group.target}…`}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
