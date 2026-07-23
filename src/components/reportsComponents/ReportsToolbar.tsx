"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import LocationFilterCombobox from "@/src/sections/leadsSections/LocationFilterCombobox";
import DateRangeMenu from "@/src/sections/reportsSections/DateRangeMenu";
import { useLocations } from "@/src/hooks/useLocations";
import type { ReportRange } from "@/src/services/reportsService";

const ALL_LOCATIONS = "All locations";

export default function ReportsToolbar({
  dateRange,
  onDateRangeChange,
  locationName,
  onLocationNameChange,
}: {
  dateRange: ReportRange;
  onDateRangeChange: (range: ReportRange) => void;
  locationName: string;
  onLocationNameChange: (name: string) => void;
}) {
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const { locations } = useLocations();
  const dateRangeLabel = DATE_RANGE_LABELS[dateRange];

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-center gap-3">
        <div className="relative shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setDateMenuOpen((prev) => !prev)}
            className="flex h-9 w-48 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <span className="truncate text-sm font-normal text-[#071123]">
              {dateRangeLabel}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              className="shrink-0 opacity-50"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#071123"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {dateMenuOpen && (
            <DateRangeMenu
              selected={dateRangeLabel}
              onSelect={(label) => onDateRangeChange(LABEL_TO_RANGE[label])}
              onClose={() => setDateMenuOpen(false)}
            />
          )}
        </div>

        <LocationFilterCombobox
          options={[ALL_LOCATIONS, ...locations.map((l) => l.name)]}
          widthClass="w-48"
          value={locationName}
          onChange={onLocationNameChange}
        />

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => {
            // TODO: actual PDF export is a follow-up task.
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-4 py-2 text-sm font-medium text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
        >
          <FileText size={16} stroke="#071123" />
          Export PDF
        </button>
      </div>
    </div>
  );
}

// MISMATCH: the original dropdown also offered "Year to date" — removed
// since section 15 only supports these 4 range values (no "Year to date"
// on the backend). See reportsService.ts.
const DATE_RANGE_LABELS: Record<ReportRange, string> = {
  last_30_days: "Last 30 days",
  last_3_months: "Last 3 months",
  last_6_months: "Last 6 months",
  last_12_months: "Last 12 months",
};

const LABEL_TO_RANGE: Record<string, ReportRange> = {
  "Last 30 days": "last_30_days",
  "Last 3 months": "last_3_months",
  "Last 6 months": "last_6_months",
  "Last 12 months": "last_12_months",
};
