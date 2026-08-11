// src/data/importsData/importsData.ts
//
// Static configuration for the spreadsheet import wizard. Everything here is
// presentation-only — the rules themselves (which fields are required, what
// a sheet may overwrite, what order entities import in) live in the backend
// registry and arrive via GET /api/imports/entities. Duplicating them here
// would let the two drift.

export type ImportStep = "mapping" | "resolve" | "preview" | "commit";

export const IMPORT_STEPS: { key: ImportStep; label: string; hint: string }[] = [
  { key: "mapping", label: "Match columns", hint: "Check where each column goes" },
  { key: "resolve", label: "Resolve names", hint: "Answer anything ambiguous" },
  { key: "preview", label: "Review", hint: "See exactly what will change" },
  { key: "commit", label: "Import", hint: "Write it to the dashboard" },
];

// Row verdicts from the backend's ImportRowStatus.
export type RowStatus =
  | "create"
  | "update"
  | "skip"
  | "needs_input"
  | "error"
  | "created"
  | "updated"
  | "failed"
  | "pending";

export const ROW_STATUS_LABELS: Record<string, string> = {
  create: "Will add",
  update: "Will update",
  skip: "No change",
  needs_input: "Needs a decision",
  error: "Can't import",
  created: "Added",
  updated: "Updated",
  failed: "Failed",
  pending: "Not checked yet",
};

// Batch lifecycle, from the backend's ImportStatus.
export const BATCH_STATUS_LABELS: Record<string, string> = {
  parsing: "Reading file",
  mapping: "Matching columns",
  preview: "Awaiting review",
  committing: "Importing",
  committed: "Imported",
  failed: "Failed",
  rolled_back: "Rolled back",
};

// How confident the column match was — shown so the admin knows which rows
// to actually check rather than scanning all of them equally.
export const MATCH_REASON_LABELS: Record<string, string> = {
  exact: "Exact",
  alias: "Known name",
  fuzzy: "Close guess",
  llm: "Suggested",
  none: "Not matched",
};

export const MATCH_REASON_COLORS: Record<string, { bg: string; text: string }> = {
  exact: { bg: "#DCFCE7", text: "#15803D" },
  alias: { bg: "#DCFCE7", text: "#15803D" },
  fuzzy: { bg: "#FFEDD5", text: "#9A611D" },
  llm: { bg: "#F3E8FF", text: "#7C3AED" },
  none: { bg: "#E2E8F0", text: "#475569" },
};

// Why a field can't be changed on an existing record. Mirrors the backend's
// Writability — showing the reason is what teaches the admin where each
// field actually lives, instead of leaving her editing a sheet column that
// silently never takes effect.
export const WRITABILITY_NOTES: Record<string, string | null> = {
  always: null,
  insert_only: "Set when the record is first added. Managed in the dashboard after that.",
  never: "Worked out automatically from the payments — can't be imported.",
};

export const DATE_ORDER_OPTIONS = [
  { value: "MDY", label: "Month / Day / Year", example: "03/04/2024 = 4 March" },
  { value: "DMY", label: "Day / Month / Year", example: "03/04/2024 = 3 April" },
];

// Excel and CSV only. Kept deliberately narrow: .xls (the pre-2007 binary
// format) and .tsv are not parsed by the backend, and letting them through the
// picker only moves the failure from "can't select that" to a server error
// after the upload.
export const ACCEPTED_FILE_TYPES = ".csv,.xlsx";
export const ACCEPTED_EXTENSIONS = [".csv", ".xlsx"] as const;

export function isAcceptedFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
