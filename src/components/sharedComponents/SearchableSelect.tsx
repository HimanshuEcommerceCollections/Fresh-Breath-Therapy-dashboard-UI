"use client";

// src/components/sharedComponents/SearchableSelect.tsx
//
// Generic searchable combobox over a caller-supplied {id, label} list —
// type to filter, click to select. Same interaction and styling as
// ClientSelect / TherapistSelect, but those each source their own data;
// this one takes whatever list it is given.
//
// Built for the import wizard's foreign-key questions, where the candidate
// list can run to 200 records and a native <select> means the admin
// scrolling a wall of names hunting for one. Anywhere a list is short (an
// enum's four values) the search box is suppressed rather than added as
// noise — see SEARCH_THRESHOLD.
//
// Selected value is the option's `id`, never its label: two therapists
// legitimately share a name, and selecting by label silently picks whichever
// comes first.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";

export interface SelectOption {
  id: string;
  label: string;
  /** Optional second line, e.g. how many rows a choice would affect. */
  hint?: string;
}

// Below this many options a search box costs more attention than it saves.
const SEARCH_THRESHOLD = 8;

export default function SearchableSelect({
  value,
  options,
  onChange,
  placeholder = "Choose…",
  searchPlaceholder = "Type to search…",
  emptyOptionLabel,
  disabled = false,
  invalid = false,
  isLoading = false,
  size = "md",
}: {
  /** Currently selected option id ("" = nothing selected). */
  value: string;
  options: SelectOption[];
  onChange: (id: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  /** When set, a first row that clears the selection (e.g. "Use the choice above"). */
  emptyOptionLabel?: string;
  disabled?: boolean;
  /** Amber styling for a required answer that hasn't been given. */
  invalid?: boolean;
  /** True while the caller is still fetching `options`. Distinguishes "no
   *  matches" from "we don't know yet" — the two look identical otherwise and
   *  only one of them is an answer. */
  isLoading?: boolean;
  size?: "sm" | "md";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.id === value) ?? null;
  const showSearch = options.length > SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    // Every word must appear somewhere, so "chen downtown" finds
    // "Sarah Chen · LPC · Downtown Clinic" regardless of field order.
    const words = q.split(/\s+/);
    return options.filter((o) => {
      const haystack = `${o.label} ${o.hint ?? ""}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [options, query]);

  // The highlight resets wherever the list changes, rather than in an effect
  // watching it — an effect would re-render a second time for every keystroke.
  const search = (next: string) => {
    setQuery(next);
    setHighlighted(0);
  };

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
    setQuery("");
    setHighlighted(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const pick = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlighted];
      if (option) pick(option.id);
    }
  };

  const height = size === "sm" ? "h-8" : "h-10";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`flex w-full ${height} cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 text-left ${text} outline-none transition-colors disabled:cursor-not-allowed disabled:bg-[#F7FBFD] disabled:text-[#94A3B8] ${
          invalid && !selected
            ? "border-[#F2A618] bg-[#FFFBF3] text-[#9A611D]"
            : "border-[#E0E5EB] bg-white text-[#071123] hover:border-[#376EF4]"
        }`}
      >
        <span className={`min-w-0 truncate ${selected ? "" : "text-[#94A3B8]"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={15} className="shrink-0 text-[#596475]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#E0E5EB] bg-white shadow-[0px_10px_30px_rgba(7,17,35,0.12)]">
          {showSearch && (
            <div className="flex items-center gap-2 border-b border-[#E0E5EB] px-3 py-2">
              <Search size={14} className="shrink-0 text-[#94A3B8]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => search(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-[#071123] outline-none placeholder:text-[#94A3B8]"
              />
              {options.length > 0 && (
                <span className="shrink-0 text-xs text-[#94A3B8]">
                  {filtered.length}/{options.length}
                </span>
              )}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto py-1">
            {emptyOptionLabel && !query.trim() && (
              <button
                type="button"
                onClick={() => pick("")}
                className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm text-[#596475] transition-colors hover:bg-[#F7FBFD]"
              >
                {emptyOptionLabel}
                {!value && <Check size={14} className="shrink-0 text-[#376EF4]" />}
              </button>
            )}

            {isLoading ? (
              <p className="flex items-center justify-center gap-2 px-3 py-6 text-center text-sm text-[#596475]">
                <Loader2 size={14} className="animate-spin" />
                Loading…
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[#596475]">
                {query
                  ? `Nothing matches “${query}”.`
                  : "Nothing to choose from."}
              </p>
            ) : (
              filtered.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => pick(option.id)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    index === highlighted ? "bg-[#F5F8FF]" : "hover:bg-[#F7FBFD]"
                  } ${option.id === value ? "text-[#376EF4]" : "text-[#071123]"}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{option.label}</span>
                    {option.hint && (
                      <span className="block truncate text-xs text-[#94A3B8]">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {option.id === value && (
                    <Check size={14} className="shrink-0 text-[#376EF4]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
