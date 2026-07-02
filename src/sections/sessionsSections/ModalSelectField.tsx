"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Select-style field shared by the Schedule Session and New Follow-Up modals.
// Visual only for now — a real listbox popover is a follow-up, same stage as
// the other select-style fields in the app. The optional className/chevron
// props let each modal apply its own palette without duplicating the
// component; defaults match the Schedule Session modal.
export default function ModalSelectField({
  label,
  value,
  icon,
  onClick,
  labelClassName = "text-sm font-semibold leading-5 text-[#0F172A]",
  shellClassName = "h-13 rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] focus:border-2 focus:border-[#2563EB]",
  valueClassName = "text-base font-normal leading-6 text-[#0F172A]",
  chevronSize = 18,
  chevronColor = "#94A3B8",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick?: () => void;
  labelClassName?: string;
  shellClassName?: string;
  valueClassName?: string;
  chevronSize?: number;
  chevronColor?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full cursor-pointer items-center gap-3 px-4 text-left focus:outline-none ${shellClassName}`}
      >
        {icon && <span className="shrink-0 text-[#94A3B8]">{icon}</span>}
        <span className={`min-w-0 flex-1 truncate ${valueClassName}`}>
          {value}
        </span>
        <ChevronDown
          size={chevronSize}
          stroke={chevronColor}
          className="shrink-0"
        />
      </button>
    </div>
  );
}
