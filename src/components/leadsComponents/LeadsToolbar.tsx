"use client";

import { useState } from "react";
import ViewToggleTabs, {
  type LeadsView,
} from "@/src/sections/leadsSections/ViewToggleTabs";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";
import LocationSelectionMenu from "@/src/sections/leadsSections/LocationSelectionMenu";
import { leadStatusOptions } from "@/src/data/leadsData/leadStatusOptions";
import { locationOptions } from "@/src/data/leadsData/locationOptions";

function ChevronIcon() {
  return (
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
  );
}

export default function LeadsToolbar({
  activeView,
  onViewChange,
}: {
  activeView: LeadsView;
  onViewChange: (view: LeadsView) => void;
}) {
  // Local input state only — actual search filtering will be wired up later.
  const [query, setQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#596475]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 13.9988L11.1067 11.1055"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="currentColor"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="h-9 w-full rounded-xl border border-[#E0E5EB] bg-white pl-9 pr-3 text-sm tracking-[-0.154px] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#596475] focus:ring-2 focus:ring-[#376EF4]/30"
          />
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setStatusMenuOpen((prev) => !prev)}
            className="flex h-9 w-56 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <span className="truncate text-sm font-normal text-[#071123]">
              {statusFilter}
            </span>
            <ChevronIcon />
          </button>
          {statusMenuOpen && (
            <StatusDropdownMenu
              options={["All statuses", ...leadStatusOptions]}
              selected={statusFilter}
              onSelect={setStatusFilter}
              onClose={() => setStatusMenuOpen(false)}
            />
          )}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setLocationMenuOpen((prev) => !prev)}
            className="flex h-9 w-44 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <span className="truncate text-sm font-normal text-[#071123]">
              {locationFilter}
            </span>
            <ChevronIcon />
          </button>
          {locationMenuOpen && (
            <LocationSelectionMenu
              options={["All locations", ...locationOptions]}
              selected={locationFilter}
              onSelect={setLocationFilter}
              onClose={() => setLocationMenuOpen(false)}
            />
          )}
        </div>

        <ViewToggleTabs activeView={activeView} onChange={onViewChange} />
      </div>
    </div>
  );
}
