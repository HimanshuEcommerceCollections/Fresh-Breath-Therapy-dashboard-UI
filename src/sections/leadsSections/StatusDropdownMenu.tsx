"use client";

import { useEffect, useRef } from "react";

function CheckmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="#0F172A"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Floating status option menu — shared by the toolbar's "All statuses" filter
// (options include "All statuses") and each table row's status combobox
// (options are the real statuses only). The trigger must stopPropagation on
// mousedown so this menu's outside-click close doesn't fight the toggle.
export default function StatusDropdownMenu({
  options,
  selected,
  onSelect,
  onClose,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-30 mt-1 w-49 rounded-[7px] border border-[#F1F5F9] bg-white py-1 shadow-[0px_6px_9px_-2px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.05)]"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          className={`flex w-full cursor-pointer items-center justify-between rounded-[5px] px-3.5 py-[7px] text-left text-[13px] font-medium text-[#0F172A] ${
            option === selected ? "bg-[#F0F9FF]" : "hover:bg-slate-50"
          }`}
        >
          <span className="truncate">{option}</span>
          {option === selected && <CheckmarkIcon />}
        </button>
      ))}
    </div>
  );
}
