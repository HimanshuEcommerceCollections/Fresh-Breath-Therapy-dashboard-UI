"use client";

import { useState } from "react";
import ViewToggleTabs, {
  type LeadsView,
} from "@/src/sections/leadsSections/ViewToggleTabs";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";
import SearchInput from "@/src/sections/leadsSections/SearchInput";
import LocationFilterCombobox from "@/src/sections/leadsSections/LocationFilterCombobox";
import { leadStatusOptions } from "@/src/data/leadsData/leadStatusOptions";
import { locationOptions } from "@/src/data/leadsData/locationOptions";

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

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, phone…"
        />

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
          {statusMenuOpen && (
            <StatusDropdownMenu
              options={["All statuses", ...leadStatusOptions]}
              selected={statusFilter}
              onSelect={setStatusFilter}
              onClose={() => setStatusMenuOpen(false)}
            />
          )}
        </div>

        <LocationFilterCombobox
          options={["All locations", ...locationOptions]}
          widthClass="w-44"
        />

        <ViewToggleTabs activeView={activeView} onChange={onViewChange} />
      </div>
    </div>
  );
}
