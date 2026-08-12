"use client";

import { Loader2, Search, X } from "lucide-react";
import type { PTOLeaderboardEntry } from "@/src/services/ptoService";
import { PTO_LEADERBOARD_GRID } from "@/src/sections/ptoDashboardSections/ptoLeaderboardGrid";
import LeaderboardRow from "@/src/sections/ptoDashboardSections/LeaderboardRow";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";

const COLUMNS: { label: string; align: "left" | "right" }[] = [
  { label: "#", align: "left" },
  { label: "Therapist", align: "left" },
  { label: "Location", align: "left" },
  { label: "YTD Sessions", align: "right" },
  { label: "PTO Accrued", align: "right" },
  { label: "PTO Used", align: "right" },
  { label: "Balance", align: "right" },
  { label: "Avg /wk", align: "right" },
];

export default function TherapistLeaderboardTable({
  leaderboard,
  isLoading,
  search,
  onSearchChange,
  isSearching,
  totalCount,
  onRecordUsage,
  canRecordUsage,
}: {
  leaderboard: PTOLeaderboardEntry[];
  isLoading: boolean;
  search: string;
  onSearchChange: (next: string) => void;
  isSearching: boolean;
  /** Unfiltered roster size, so the header can say "3 of 152". */
  totalCount: number;
  onRecordUsage: () => void;
  /** Admin only — POST /api/pto/usage rejects everyone else. */
  canRecordUsage: boolean;
}) {
  const isFiltered = search.trim().length > 0;

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap items-end justify-between gap-3 px-6 pt-5">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
            Therapist Leaderboard
          </h3>
          <p className="text-xs font-normal text-[#596475]">
            {isFiltered
              ? `${leaderboard.length} of ${totalCount} therapists`
              : "Ranked by PTO balance"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search therapist, credential or location…"
              className="h-9 w-full min-w-[260px] rounded-lg border border-[#E0E5EB] bg-white pl-9 pr-9 text-sm text-[#071123] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#376EF4]"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {canRecordUsage && (
            <button
              type="button"
              onClick={onRecordUsage}
              className="flex h-9 shrink-0 cursor-pointer items-center rounded-lg bg-[#376EF4] px-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Record PTO used
            </button>
          )}
        </div>
      </div>

      <div className={`${PTO_LEADERBOARD_GRID} border-b border-[#E0E5EB] px-4 pt-2`}>
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className={`px-2 py-2.5 text-sm font-medium leading-5 text-[#596475] ${
              column.align === "right" ? "text-right" : ""
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div>
        {isLoading ? (
          <TableSkeleton gridClassName={PTO_LEADERBOARD_GRID} columns={COLUMNS.length} rows={7} />
        ) : leaderboard.length === 0 ? (
          <p className="flex items-center justify-center gap-2 px-6 py-10 text-center text-sm text-[#596475]">
            {/* Same rule as every other search on the site: "no matches" is
                only an answer once the filter has actually settled. */}
            {isSearching ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Searching…
              </>
            ) : (
              `No therapist matches “${search.trim()}”.`
            )}
          </p>
        ) : (
          leaderboard.map((entry) => <LeaderboardRow key={entry.therapistId} entry={entry} />)
        )}
      </div>
    </div>
  );
}
