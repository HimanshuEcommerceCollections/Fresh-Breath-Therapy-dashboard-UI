"use client";

// src/components/sharedComponents/TherapistSelect.tsx
//
// Reusable therapist dropdown — selects by the therapist's `id`, not their
// display name. Forms that matched by name (`therapists.find(t => t.name ===
// selectedName)`) silently assign the wrong therapist whenever two therapist
// records share a name — the lookup just returns whichever one happens to
// come first. Selecting by id makes that class of bug impossible.

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, User } from "lucide-react";
import { useTherapists } from "@/src/hooks/useTherapists";

export default function TherapistSelect({
  label = "Assigned Therapist",
  placeholder = "Select therapist",
  value,
  onChange,
  labelClassName = "text-xs font-semibold tracking-[0.6px] text-[#434655]",
  shellClassName = "h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF]",
}: {
  label?: string;
  placeholder?: string;
  /** Currently selected therapist ID (empty string = nothing selected). */
  value: string;
  /** Called with the newly selected therapist's ID. */
  onChange: (id: string) => void;
  labelClassName?: string;
  shellClassName?: string;
}) {
  const { therapists } = useTherapists();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = therapists.find((t) => t.id === value) ?? null;

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>

      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
        >
          <User size={16} />
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full cursor-pointer items-center justify-between gap-2 pl-10 pr-4 text-left outline-none ${shellClassName}`}
        >
          <span className={`truncate text-base ${selected ? "text-[#0B1C30]" : "text-[#6B7280]"}`}>
            {selected ? `${selected.name} — ${selected.location.name}` : placeholder}
          </span>
          <ChevronDown size={16} className="shrink-0 text-[#434655]" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 max-h-[280px] w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          {therapists.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#94A3B8]">No therapists yet</p>
          ) : (
            therapists.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left text-sm text-[#0B1C30] ${
                  t.id === value ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"
                }`}
              >
                <span className="flex min-w-0 flex-1 flex-col overflow-hidden">
                  <span className="truncate">
                    {t.name} — {t.location.name}
                  </span>
                  <span className="truncate text-xs text-[#94A3B8]">{t.email}</span>
                </span>
                {t.id === value && <Check size={14} stroke="#2563EB" strokeWidth={2.5} className="shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
