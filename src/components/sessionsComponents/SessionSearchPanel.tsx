"use client";

// Search across sessions by client or therapist name.
//
// Deliberately NOT bounded by the date range the calendar is showing. An admin
// searching for a name is looking for a session to correct, and limiting that
// to whichever week happens to be on screen would hide the one they want. The
// results sit above the calendar with their own Edit buttons, so finding and
// fixing is one continuous action rather than "search, note the date, navigate
// there, then edit".

import { Loader2, Pencil, Search, X } from "lucide-react";
import { dayStatusColorData } from "@/src/data/sessionsData/dayStatusColorData";
import type { Session } from "@/src/services/sessionsService";

export default function SessionSearchPanel({
  value,
  onChange,
  results,
  isSearching,
  isActive,
  onEdit,
}: {
  value: string;
  onChange: (next: string) => void;
  results: Session[];
  isSearching: boolean;
  isActive: boolean;
  onEdit: (session: Session) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search sessions by client or therapist name…"
          className="h-11 w-full rounded-xl border border-[#E0E5EB] bg-white pl-11 pr-11 text-sm text-[#071123] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#376EF4]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isActive && (
        <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E0E5EB] px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
              Search results · {results.length}
              {results.length === 50 && " (first 50)"}
            </p>
            {isSearching && (
              <Loader2 size={14} className="animate-spin text-[#376EF4]" />
            )}
          </div>

          {results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[#596475]">
              {isSearching
                ? "Searching…"
                : `No sessions found for “${value}”. Searches match client and therapist names.`}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((session) => {
                const pill = dayStatusColorData[session.status];
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-3 border-b border-[#E0E5EB] px-5 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#071123]">
                        {session.client}
                      </p>
                      <p className="truncate text-xs text-[#596475]">
                        {/* Date shown because results span every week — without
                            it a row is unidentifiable among repeats. */}
                        {session.date} at {session.time} · {session.type} ·{" "}
                        {session.therapist}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          backgroundColor: pill.bg,
                          borderColor: pill.border,
                          color: pill.text,
                        }}
                      >
                        {session.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onEdit(session)}
                        className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#376EF4] transition-colors hover:bg-[#F5F8FF]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
