"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import PreviewRowItem from "@/src/sections/importsSections/PreviewRowItem";
import { rowStatusBadges } from "@/src/data/importsData/importStatusBadges";
import { ROW_STATUS_LABELS } from "@/src/data/importsData/importsData";
import type { ImportEntity, ImportPreview } from "@/src/services/importsService";

const FILTERS = ["create", "update", "skip", "needs_input", "error"] as const;

/**
 * Step 3 — the dry run.
 *
 * Everything on this screen was computed against the real database and
 * written nowhere. The counts are the headline; the filters exist because
 * the row the admin actually needs is almost always an error in a list of a
 * thousand successes.
 */
export default function PreviewStep({
  preview,
  entity,
  isRefreshing,
  isEditingRow,
  onEditRow,
  onResolveRow,
  onCommit,
}: {
  preview: ImportPreview;
  entity: ImportEntity;
  isRefreshing: boolean;
  isEditingRow: boolean;
  onEditRow: (payload: {
    rowNumber: number;
    values: Record<string, unknown>;
  }) => Promise<unknown>;
  /** Saves a foreign-key pick for one row as a row-level resolution. */
  onResolveRow: (payload: {
    rowNumber: number;
    values: Record<string, string>;
  }) => Promise<unknown>;
  onCommit: () => void;
}) {
  const [filter, setFilter] = useState<string | null>(null);

  const fieldLabel = (name: string) =>
    entity.fields.find((f) => f.name === name)?.label ?? name;
  const fieldKind = (name: string) =>
    entity.fields.find((f) => f.name === name)?.kind ?? "text";

  /**
   * Which existing records this row's field could point at.
   *
   * Taken from the resolver's own groups, so the list is already narrowed the
   * way the resolver narrowed it — for an ambiguous therapist at a known
   * location that's the two people actually at that location, not all 150.
   */
  const candidatesFor = (field: string, rowNumber: number) => {
    const group = preview.fkGroups.find(
      (g) => g.field === field && g.rows.some((r) => r.rowNumber === rowNumber)
    );
    return group?.candidates ?? [];
  };

  const rows = filter
    ? preview.rows.filter((r) => r.status === filter)
    : preview.rows;

  const willWrite = (preview.counts.create ?? 0) + (preview.counts.update ?? 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {FILTERS.map((key) => {
          const count = preview.counts[key] ?? 0;
          const badge = rowStatusBadges[key];
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(isActive ? null : key)}
              className={`cursor-pointer rounded-xl border px-3.5 py-3 text-left transition-colors ${
                isActive
                  ? "border-[#376EF4] bg-[#F5F8FF]"
                  : "border-[#E0E5EB] bg-white hover:bg-[#F7FBFD]"
              }`}
            >
              <span
                className="block text-xl font-semibold tracking-[-0.4px]"
                style={{ color: count > 0 ? badge.text : "#94A3B8" }}
              >
                {count}
              </span>
              <span className="mt-0.5 block text-xs text-[#596475]">
                {ROW_STATUS_LABELS[key]}
              </span>
            </button>
          );
        })}
      </div>

      {preview.blockers.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#F2A618] bg-[#FFFBF3] px-4 py-3">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#9A611D]" />
          <div>
            <p className="text-sm font-medium text-[#9A611D]">
              Can&apos;t import yet
            </p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {preview.blockers.map((blocker) => (
                <li key={blocker} className="text-xs text-[#9A611D]">
                  · {blocker}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#E0E5EB] px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
            {filter ? ROW_STATUS_LABELS[filter] : "All rows"} · {rows.length} shown
          </p>
          {isRefreshing && (
            <Loader2 size={14} className="animate-spin text-[#376EF4]" />
          )}
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#596475]">
            No rows in this category.
          </p>
        ) : (
          <div className="max-h-115 overflow-y-auto">
            {rows.map((row) => (
              <PreviewRowItem
                key={row.rowNumber}
                row={row}
                fieldLabel={fieldLabel}
                fieldKind={fieldKind}
                candidatesFor={(field) => candidatesFor(field, row.rowNumber)}
                isSaving={isEditingRow}
                onEdit={(values) =>
                  onEditRow({ rowNumber: row.rowNumber, values })
                }
                onResolve={(values) =>
                  onResolveRow({ rowNumber: row.rowNumber, values })
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#596475]">
          Rows that can&apos;t be imported are skipped — fix them in your sheet and
          upload again. Nothing here has been saved yet.
        </p>
        <button
          type="button"
          disabled={!preview.canCommit}
          onClick={onCommit}
          className="cursor-pointer rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Import {willWrite.toLocaleString()} row{willWrite === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
}
