// src/data/importsData/importStatusBadges.ts
//
// Pastel badge colors matching leadStatusBadgeColors — same visual language
// as the rest of the dashboard so a verdict pill reads the same way a lead
// status pill does.

export const rowStatusBadges: Record<string, { bg: string; text: string }> = {
  create: { bg: "#DCFCE7", text: "#15803D" },
  created: { bg: "#DCFCE7", text: "#15803D" },
  update: { bg: "#DCF4FF", text: "#2C7EA1" },
  updated: { bg: "#DCF4FF", text: "#2C7EA1" },
  skip: { bg: "#E2E8F0", text: "#475569" },
  pending: { bg: "#E2E8F0", text: "#475569" },
  // Purple: not a failure (nothing to fix) and not a success (nothing was
  // written) — a category of its own, and the reason a row count shrinks.
  duplicate: { bg: "#F3E8FF", text: "#7C3AED" },
  needs_input: { bg: "#FFEDD5", text: "#9A611D" },
  error: { bg: "#FEE2E2", text: "#B91C1C" },
  failed: { bg: "#FEE2E2", text: "#B91C1C" },
};

export const batchStatusBadges: Record<string, { bg: string; text: string }> = {
  parsing: { bg: "#E2E8F0", text: "#475569" },
  mapping: { bg: "#FFEDD5", text: "#9A611D" },
  preview: { bg: "#DCF4FF", text: "#2C7EA1" },
  committing: { bg: "#DCF4FF", text: "#2C7EA1" },
  committed: { bg: "#DCFCE7", text: "#15803D" },
  failed: { bg: "#FEE2E2", text: "#B91C1C" },
  rolled_back: { bg: "#E2E8F0", text: "#475569" },
};

export const fkStatusBadges: Record<string, { bg: string; text: string; label: string }> = {
  resolved: { bg: "#DCFCE7", text: "#15803D", label: "Matched" },
  will_create: { bg: "#DCF4FF", text: "#2C7EA1", label: "Will be created" },
  ambiguous: { bg: "#FFEDD5", text: "#9A611D", label: "Pick one" },
  missing: { bg: "#FEE2E2", text: "#B91C1C", label: "Not found" },
};
