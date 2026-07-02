"use client";

import { useState } from "react";
import type { LeadStatus } from "@/src/data/leadsData/leadsData";
import { leadStatusOptions } from "@/src/data/leadsData/leadStatusOptions";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";

export default function StatusCombobox({ status }: { status: LeadStatus }) {
  // Local-only status change for now — no backend call yet, the UI just
  // reflects the newly selected status for this row.
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(status);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 w-45 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
      >
        <span className="truncate text-sm font-normal text-[#071123]">
          {currentStatus}
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
      {isOpen && (
        <StatusDropdownMenu
          options={leadStatusOptions}
          selected={currentStatus}
          onSelect={(value) => setCurrentStatus(value as LeadStatus)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
