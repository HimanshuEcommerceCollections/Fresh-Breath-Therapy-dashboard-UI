"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { searchNavigation } from "@/src/data/layoutData/searchTargets";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

// Jump-to-page search. Typing anything associated with a section ("pto",
// ".clients", "invoice", "time off") and pressing Enter navigates there.
// Results are filtered by role, so a Therapist is never offered a page that
// would immediately bounce them back to /leads.
export default function HeaderSearchBar() {
  const router = useRouter();
  const { role } = useCurrentUser();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchNavigation(query, role), [query, role]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  function go(href: string) {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[activeIndex]?.href ?? results[0].href);
    }
  }

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={boxRef} className="relative w-full max-w-112">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#596475]"
      >
        <Search size={16} />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search leads, clients, sessions…"
        aria-label="Search pages"
        className="h-9 w-full rounded-xl bg-[rgba(239,244,250,0.4)] pl-9 pr-3 text-sm tracking-[-0.154px] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] outline-none placeholder:text-[#596475] focus:ring-2 focus:ring-[#376EF4]/30"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 z-40 mt-1 overflow-hidden rounded-xl border border-[#E0E5EB] bg-white p-1 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-[#94A3B8]">
              No page matches “{query.trim()}”.
            </p>
          ) : (
            results.map((target, index) => (
              <button
                key={target.href}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(target.href)}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  index === activeIndex ? "bg-[#F7FBFD]" : "hover:bg-[#F7FBFD]"
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-[#071123]">
                    {target.label}
                  </span>
                  <span className="truncate text-xs text-[#94A3B8]">
                    {target.group.toLowerCase()} · {target.href}
                  </span>
                </span>
                {index === activeIndex && (
                  <CornerDownLeft size={14} className="shrink-0 text-[#94A3B8]" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
