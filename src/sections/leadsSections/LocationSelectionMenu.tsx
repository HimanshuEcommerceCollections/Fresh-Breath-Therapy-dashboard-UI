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

// Floating location option menu used by the toolbar's "All locations" filter.
export default function LocationSelectionMenu({
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
      className="absolute left-0 top-full z-30 mt-1 flex w-[173px] flex-col gap-[3px] rounded-[5px] bg-white p-[5px] shadow-[0px_6.5px_10px_-2px_rgba(0,0,0,0.1),0px_2.5px_4px_-1px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(0,0,0,0.05)]"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => {
            onSelect(option);
            onClose();
          }}
          className={`flex w-full cursor-pointer items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-[13px] font-medium text-[#0F172A] ${
            option === selected ? "bg-[#EFF6FF]" : "hover:bg-slate-50"
          }`}
        >
          <span className="truncate">{option}</span>
          {option === selected && <CheckmarkIcon />}
        </button>
      ))}
    </div>
  );
}
