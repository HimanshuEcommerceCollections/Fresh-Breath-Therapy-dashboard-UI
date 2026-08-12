"use client";

// src/components/ui/ChartPager.tsx
//
// The ‹ › control pair that sits in a chart card's header, paging a
// categorical x-axis six entries at a time. Pairs with useChartPages.
//
// Renders nothing at all when the data fits on one page, so dropping this into
// a chart is safe regardless of how much data it happens to hold today — a
// clinic with four locations sees the chart exactly as before, and the controls
// appear on their own once a fifth pushes it past the limit.

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ChartPager({
  rangeLabel,
  canPrev,
  canNext,
  onPrev,
  onNext,
  isPaged,
  label,
}: {
  rangeLabel: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** False when everything fits on one page — the whole control hides. */
  isPaged: boolean;
  /** What's being paged, for the screen-reader labels: "locations". */
  label: string;
}) {
  if (!isPaged) return null;

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="text-xs font-normal tabular-nums text-[#596475]">
        {rangeLabel}
      </span>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`Previous ${label}`}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[#E0E5EB] bg-white text-[#596475] transition-colors hover:border-[#376EF4] hover:text-[#376EF4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E5EB] disabled:hover:text-[#596475]"
      >
        <ChevronLeft size={15} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={`Next ${label}`}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[#E0E5EB] bg-white text-[#596475] transition-colors hover:border-[#376EF4] hover:text-[#376EF4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E0E5EB] disabled:hover:text-[#596475]"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
