"use client";

import type { ReactNode } from "react";

// Plainer native-select field used only inside the Add Lead modal — visually
// distinct from the floating StatusDropdownMenu/LocationSelectionMenu.
export default function FormSelect({
  label,
  icon,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: ReactNode;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
        {label}
      </span>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        >
          {icon}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] pl-11 pr-10 text-base outline-none focus:ring-2 focus:ring-[#325A5E]/30 ${
            value ? "text-[#0B1C30]" : "text-[#6B7280]"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#434655]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </label>
  );
}
