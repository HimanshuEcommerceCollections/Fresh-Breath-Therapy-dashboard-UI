"use client";

import { useState } from "react";
import LocationSelectionMenu from "@/src/sections/leadsSections/LocationSelectionMenu";

// Shared location filter combobox (Leads, Clients toolbars). The first option
// is the default "All locations" entry. Selection is local state only —
// actual filtering is wired up later.
export default function LocationFilterCombobox({
  options,
  widthClass,
}: {
  options: string[];
  widthClass: string;
}) {
  const [selected, setSelected] = useState(options[0]);
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
