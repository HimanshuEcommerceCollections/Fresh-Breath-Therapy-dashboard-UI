"use client";

import { useState } from "react";
import LocationSelectionMenu from "@/src/sections/leadsSections/LocationSelectionMenu";

// Shared location filter combobox (Leads, Clients, Therapists, Reports
// toolbars). The first option is the default "All locations" entry.
// Optionally controlled via `value`/`onChange` (used by Leads to drive a
// real location_id filter) — falls back to internal state when omitted, so
// toolbars that haven't been wired to real filtering yet are unaffected.
export default function LocationFilterCombobox({
  options,
  widthClass,
  value,
  onChange,
}: {
  options: string[];
  widthClass: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(options[0]);
  const selected = value ?? internalSelected;
  const setSelected = onChange ?? setInternalSelected;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-9 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] ${widthClass}`}
      >
        <span className="truncate text-sm font-normal text-[#071123]">
          {selected}
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
        <LocationSelectionMenu
          options={options}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
