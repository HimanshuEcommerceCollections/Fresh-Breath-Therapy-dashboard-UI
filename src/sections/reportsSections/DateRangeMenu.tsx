"use client";

import SimpleOptionMenu from "@/src/sections/leadsSections/SimpleOptionMenu";

// MISMATCH: "Year to date" removed — section 15 only supports
// last_30_days|last_3_months|last_6_months|last_12_months, no "Year to
// date" range exists on the backend.
export const dateRangeOptions = [
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
];

// Thin semantic wrapper over the generic SimpleOptionMenu. Visual only for
// now; no real date-filtering logic yet.
export default function DateRangeMenu({
  selected,
  onSelect,
  onClose,
}: {
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <SimpleOptionMenu
      options={dateRangeOptions}
      selected={selected}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
