"use client";

import LocationSelectionMenu from "@/src/sections/leadsSections/LocationSelectionMenu";

// MISMATCH: "Year to date" removed — section 15 only supports
// last_30_days|last_3_months|last_6_months|last_12_months, no "Year to
// date" range exists on the backend.
export const dateRangeOptions = [
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
];

// Same floating-menu pattern as the location filter — LocationSelectionMenu
// is already a generic option list, so this is a thin semantic wrapper rather
// than a duplicate implementation. Visual only for now; no real
// date-filtering logic yet.
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
    <LocationSelectionMenu
      options={dateRangeOptions}
      selected={selected}
      onSelect={onSelect}
      onClose={onClose}
    />
  );
}
