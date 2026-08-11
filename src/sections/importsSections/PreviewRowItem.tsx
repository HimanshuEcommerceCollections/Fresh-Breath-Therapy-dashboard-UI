"use client";

import { useState } from "react";
import { AlertCircle, Ban, ArrowRight, Loader2, Pencil } from "lucide-react";
import ImportStatusBadge from "@/src/sections/importsSections/ImportStatusBadge";
import SearchableSelect from "@/src/components/sharedComponents/SearchableSelect";
import { rowStatusBadges } from "@/src/data/importsData/importStatusBadges";
import { ROW_STATUS_LABELS } from "@/src/data/importsData/importsData";
import type { PreviewRow } from "@/src/services/importsService";

const display = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "empty";
  return String(value);
};

/**
 * One spreadsheet row's verdict.
 *
 * `refused` entries are the important detail: a change the sheet asked for
 * that policy declined, shown with its reason. Silently dropping them would
 * leave the admin editing a column for months wondering why nothing happens;
 * showing them is what teaches her which fields live in the dashboard.
 */
export default function PreviewRowItem({
  row,
  fieldLabel,
  fieldKind,
  candidatesFor,
  onEdit,
  onResolve,
  isSaving,
}: {
  row: PreviewRow;
  fieldLabel: (name: string) => string;
  /** Field kind, so a foreign key gets a record picker and not a text box. */
  fieldKind?: (name: string) => string;
  /** Existing records this row's field could point at. */
  candidatesFor?: (name: string) => { id: string; label: string }[];
  /** Omitted on read-only screens (the post-commit failure list). */
  onEdit?: (values: Record<string, unknown>) => Promise<unknown>;
  /** Saves a foreign key choice as a row-level resolution. */
  onResolve?: (values: Record<string, string>) => Promise<unknown>;
  isSaving?: boolean;
}) {
  const isFk = (name: string) => fieldKind?.(name) === "fk";
  const badge = rowStatusBadges[row.status] ?? rowStatusBadges.pending;
  const changes = Object.entries(row.diff?.changes ?? {});
  const refused = Object.entries(row.diff?.refused ?? {});

  // Only errors tied to a specific field can be fixed here — a row-level
  // problem (a duplicate enrollment, say) isn't a cell to retype.
  const fixable = row.errors.filter((e) => e.field);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const startEditing = () => {
    setDraft(
      Object.fromEntries(
        fixable.map((e) => [
          e.field as string,
          // A foreign key starts empty — the name is exactly what's ambiguous,
          // so pre-filling it would invite retyping the same unhelpful string.
          // Everything else seeds with the value that failed, so a typo is a
          // one-character fix rather than a retype.
          isFk(e.field as string)
            ? ""
            : e.value ?? String(row.values[e.field as string] ?? ""),
        ])
      )
    );
    setIsEditing(true);
  };

  const save = async () => {
    // Two different kinds of fix. A foreign key resolves to a RECORD ID and
    // is stored as a row-level resolution; anything else is a cell value
    // layered over the sheet. Sending an id as a cell override would just be
    // a new string for the resolver to fail to match.
    const picks: Record<string, string> = {};
    const cells: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(draft)) {
      if (isFk(field)) {
        if (value) picks[field] = value;
      } else {
        cells[field] = value;
      }
    }
    try {
      if (Object.keys(picks).length > 0 && onResolve) await onResolve(picks);
      if (Object.keys(cells).length > 0 && onEdit) await onEdit(cells);
      setIsEditing(false);
    } catch {
      // Keep the editor open with the admin's input intact — closing it on a
      // failed save would look like the fix was accepted. The error surfaces
      // via the toast, or the re-check banner above the list.
    }
  };

  const canSave = fixable.every((e) => {
    const field = e.field as string;
    // A picker must actually have a pick; text may legitimately be cleared.
    return !isFk(field) || Boolean(draft[field]);
  });

  // Enough to recognise the row without dumping every column at her.
  const identity =
    (row.values.name as string) ||
    (row.values.email as string) ||
    (row.values.client as string) ||
    `Row ${row.rowNumber}`;

  return (
    <div className="border-b border-[#E0E5EB] px-5 py-3.5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-14 shrink-0 text-xs font-medium text-[#94A3B8]">
          Line {row.rowNumber}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#071123]">
          {identity}
        </span>
        <ImportStatusBadge
          label={ROW_STATUS_LABELS[row.status] ?? row.status}
          bg={badge.bg}
          text={badge.text}
        />
      </div>

      {row.errors.length > 0 && !isEditing && (
        <div className="mt-2 pl-17">
          <ul className="flex flex-col gap-1">
            {row.errors.map((error, index) => (
              <li
                key={`${error.field ?? "row"}-${index}`}
                className="flex items-start gap-1.5 text-xs text-[#B91C1C]"
              >
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                <span>
                  {error.field && (
                    <strong className="font-medium">{fieldLabel(error.field)}: </strong>
                  )}
                  {error.message}
                </span>
              </li>
            ))}
          </ul>

          {onEdit && fixable.length > 0 && (
            <button
              type="button"
              onClick={startEditing}
              className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#376EF4] hover:underline"
            >
              <Pencil size={12} />
              Fix {fixable.length === 1 ? "it" : "these"} here
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-2 ml-17 flex flex-col gap-2 rounded-lg border border-[#376EF4] bg-[#F5F8FF] p-3">
          <p className="text-xs text-[#596475]">
            Corrects this import only — your spreadsheet isn&apos;t changed.
          </p>
          {fixable.map((error) => (
            <div key={error.field} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#071123]">
                {fieldLabel(error.field as string)}
              </label>
              {isFk(error.field as string) ? (
                <SearchableSelect
                  value={draft[error.field as string] ?? ""}
                  options={candidatesFor?.(error.field as string) ?? []}
                  onChange={(id) =>
                    setDraft((previous) => ({
                      ...previous,
                      [error.field as string]: id,
                    }))
                  }
                  invalid
                  placeholder={`Search ${fieldLabel(
                    error.field as string
                  ).toLowerCase()} by name…`}
                  searchPlaceholder="Type a name, location or credential…"
                />
              ) : (
                <input
                  autoFocus={error === fixable[0]}
                  value={draft[error.field as string] ?? ""}
                  onChange={(e) =>
                    setDraft((previous) => ({
                      ...previous,
                      [error.field as string]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void save();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                  className="h-9 rounded-lg border border-[#C3C6D7] bg-white px-2.5 text-sm text-[#071123] outline-none focus:border-[#376EF4]"
                />
              )}
              <p className="text-xs text-[#B91C1C]">{error.message}</p>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSaving || !canSave}
              onClick={() => void save()}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#376EF4] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 size={12} className="animate-spin" />}
              Save and re-check
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-[#596475] transition-colors hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {changes.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 pl-17">
          {changes.map(([field, change]) => (
            <li key={field} className="flex items-center gap-1.5 text-xs text-[#596475]">
              <span className="font-medium text-[#071123]">{fieldLabel(field)}</span>
              <span className="text-[#94A3B8]">{display(change.from)}</span>
              <ArrowRight size={11} className="shrink-0 text-[#94A3B8]" />
              <span className="font-medium text-[#2C7EA1]">{display(change.to)}</span>
            </li>
          ))}
        </ul>
      )}

      {refused.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 pl-17">
          {refused.map(([field, entry]) => (
            <li
              key={field}
              className="flex items-start gap-1.5 text-xs text-[#9A611D]"
              title={entry.reason}
            >
              <Ban size={12} className="mt-0.5 shrink-0" />
              <span>
                <strong className="font-medium">{fieldLabel(field)}</strong> stays{" "}
                <strong className="font-medium">{display(entry.current)}</strong> —
                your sheet says {display(entry.sheet)}, but this one is managed in
                the dashboard.
              </span>
            </li>
          ))}
        </ul>
      )}

      {row.diff?.note && (
        <p className="mt-2 pl-17 text-xs text-[#596475]">{row.diff.note}</p>
      )}
    </div>
  );
}
