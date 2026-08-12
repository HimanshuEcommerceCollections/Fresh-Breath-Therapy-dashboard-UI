"use client";

// src/components/sharedComponents/TherapistSelect.tsx
//
// Reusable therapist dropdown — selects by the therapist's `id`, not their
// display name. Forms that matched by name (`therapists.find(t => t.name ===
// selectedName)`) silently assign the wrong therapist whenever two therapist
// records share a name — the lookup just returns whichever one happens to
// come first. Selecting by id makes that class of bug impossible.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, User } from "lucide-react";
import { useTherapists } from "@/src/hooks/useTherapists";

// Above this many therapists, scrolling to find one stops being reasonable.
const SEARCH_THRESHOLD = 8;

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
  const { therapists, isLoading } = useTherapists();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = therapists.find((t) => t.id === value) ?? null;
  const showSearch = therapists.length > SEARCH_THRESHOLD;

  // Every word must appear somewhere across name, location and email, so
  // "chen downtown" finds the right one of two same-named therapists without
  // the admin having to remember which field holds what.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return therapists;
    const words = q.split(/\s+/);
    return therapists.filter((t) => {
      const haystack = `${t.name} ${t.location.name} ${t.email}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [therapists, query]);

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
          onClick={() => {
            const next = !isOpen;
            setIsOpen(next);
            setQuery("");
            if (next) setTimeout(() => searchRef.current?.focus(), 0);
          }}
          className={`flex w-full cursor-pointer items-center justify-between gap-2 pl-10 pr-4 text-left outline-none ${shellClassName}`}
        >
          <span className={`truncate text-base ${selected ? "text-[#0B1C30]" : "text-[#6B7280]"}`}>
            {selected ? `${selected.name} — ${selected.location.name}` : placeholder}
          </span>
          <ChevronDown size={16} className="shrink-0 text-[#434655]" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          {showSearch && (
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-3 py-2">
              <Search size={14} className="shrink-0 text-[#94A3B8]" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, location or email…"
                className="w-full bg-transparent text-sm text-[#0B1C30] outline-none placeholder:text-[#94A3B8]"
              />
              <span className="shrink-0 text-xs text-[#94A3B8]">
                {filtered.length}/{therapists.length}
              </span>
            </div>
          )}
          <div className="max-h-[280px] overflow-y-auto">
          {therapists.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#94A3B8]">
              {/* "No therapists yet" is only true once we know. Until then it
                  is a wrong answer that reads as authoritative. */}
              {isLoading ? "Loading therapists…" : "No therapists yet"}
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#94A3B8]">
              Nothing matches &ldquo;{query}&rdquo;.
            </p>
          ) : (
            filtered.map((t) => (
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
        </div>
      )}
    </div>
  );
}
