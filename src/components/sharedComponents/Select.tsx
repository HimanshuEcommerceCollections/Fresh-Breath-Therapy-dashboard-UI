"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

// Generic controlled dropdown — trigger + floating option panel, closes on
// outside click and Escape. Shared across features (Assigned Clinic,
// Employment Status, session Type, Package, Referral Source, Role pill).
//
// Props added since initial version:
//   triggerClassName — fully replaces the default neutral trigger styles,
//     used by RolePill to apply coloured-pill styling per role.
//   hideLabel — suppresses the label span, used by RolePill (label-less).
export default function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  triggerClassName,
  hideLabel = false,
}: {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** Replaces the default trigger button className when provided. */
  triggerClassName?: string;
  /** When true, the label span above the trigger is not rendered. */
  hideLabel?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const defaultTriggerClass =
    "relative flex h-auto w-full cursor-pointer items-center rounded-lg border border-[#E2E8F0] py-2.5 pl-4 pr-10 text-left text-base outline-none";

  return (
    <div ref={containerRef} className="relative flex w-65 flex-col gap-1.5">
      {!hideLabel && (
        <span className="text-sm font-bold text-[#1E293B]">{label}</span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={triggerClassName ?? defaultTriggerClass}
      >
        <span className={`truncate ${value ? "text-[#1E293B]" : "text-[#94A3B8]"}`}>
          {value || placeholder}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#6B7280"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 w-full min-w-[160px] rounded-xl border border-[rgba(0,0,0,0.05)] bg-white p-2 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-left text-base text-[#1E293B] ${
                option === value ? "bg-[#EFF6FF]" : "hover:bg-[#F0F4F8]"
              }`}
            >
              <span>{option}</span>
              {option === value && (
                <Check size={14} stroke="#2563EB" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
