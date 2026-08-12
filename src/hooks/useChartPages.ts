// src/hooks/useChartPages.ts
"use client";

// Splits a chart's data into fixed-size pages so a categorical x-axis stays
// readable however many entities the business grows to.
//
// Why this exists: charts keyed on an entity list — locations, therapists —
// have an x-axis whose length is set by the data, not by the chart. At 6
// locations the labels read fine; at 47 they collapse into an unreadable
// smear, which is exactly what the PTO and Team Performance charts were
// doing. Paging is the fix rather than rotating labels or scrolling, because
// each page then gets the same generous label room the chart was designed for.
//
// Deliberately NOT applied to time-series charts (month/week axes). Those are
// bounded by the range filter, and a trend split across pages stops being a
// trend — you can't see a rise you have to click to reach.

import { useMemo, useState } from "react";

export const DEFAULT_CHART_PAGE_SIZE = 6;

export function useChartPages<T>(
  data: T[],
  pageSize: number = DEFAULT_CHART_PAGE_SIZE,
) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));

  // Clamped on read rather than corrected in an effect. The data can shrink
  // under us — a location filter cutting 47 therapists to 4 — which would
  // leave `page` pointing past the end and render an empty chart with no clue
  // why. Deriving it means there is no stale value to resynchronise, so no
  // effect and no extra render.
  //
  // The nav callbacks below step from `safePage`, not from `page`. Stepping
  // from the raw value would mean that after a shrink from page 7 to a
  // one-page dataset, "previous" would walk 6→5→4 invisibly before anything
  // on screen moved.
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * pageSize;

  const pageData = useMemo(
    () => data.slice(start, start + pageSize),
    [data, start, pageSize],
  );

  return {
    pageData,
    page: safePage,
    pageCount,
    // Only worth showing controls once there is a second page.
    isPaged: data.length > pageSize,
    // Human-readable 1-based range, e.g. "7–12 of 47".
    rangeLabel: `${data.length === 0 ? 0 : start + 1}–${Math.min(start + pageSize, data.length)} of ${data.length}`,
    canPrev: safePage > 0,
    canNext: safePage < pageCount - 1,
    prev: () => setPage(Math.max(0, safePage - 1)),
    next: () => setPage(Math.min(pageCount - 1, safePage + 1)),
  };
}
