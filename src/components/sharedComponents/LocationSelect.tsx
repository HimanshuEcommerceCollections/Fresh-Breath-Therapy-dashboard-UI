"use client";

// src/components/sharedComponents/LocationSelect.tsx
//
// Reusable location dropdown — sources the real locations list itself via
// useLocations() (same as LocationFilterCombobox's toolbar usage), so every
// form that needs to pick a location gets the live list for free. Admins
// additionally get an inline "+ Add new location" row that creates one via
// POST /api/locations (useLocations().createLocation) and selects it
// immediately — matching Locations' Admin-full-R/W permission.
//
// Selected value is the location's `id` (not its name), consistent with
// ClientSelect's id-based selection.

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search } from "lucide-react";

// Above this many locations, scrolling to find one stops being reasonable.
const SEARCH_THRESHOLD = 8;
import { useLocations } from "@/src/hooks/useLocations";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";

export default function LocationSelect({
  label = "Location",
  placeholder = "Select location",
  value,
  onChange,
  labelClassName = "text-xs font-semibold tracking-[0.6px] text-[#434655]",
  shellClassName = "h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF]",
}: {
  label?: string;
  placeholder?: string;
  /** Currently selected location ID (empty string = nothing selected). */
  value: string;
  /** Called with the newly selected (or newly created) location's ID. */
  onChange: (id: string) => void;
  labelClassName?: string;
  shellClassName?: string;
}) {
  const { locations, createLocation, isLoading } = useLocations();
  const { role } = useCurrentUser();
  const canAdd = isAdmin(role);

  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = locations.find((l) => l.id === value) ?? null;
  const showSearch = locations.length > SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((l) => l.name.toLowerCase().includes(q));
  }, [locations, query]);

  function closeDropdown() {
    setIsOpen(false);
    setIsAdding(false);
    setNewName("");
    setQuery("");
  }

  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDropdown();
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  async function handleCreate() {
    const name = newName.trim();
    if (!name || isSaving) return;
    setIsSaving(true);
    try {
      const location = await createLocation(name);
      onChange(location.id);
      closeDropdown();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>

      <button
        type="button"
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          setQuery("");
          if (next) setTimeout(() => searchRef.current?.focus(), 0);
        }}
        className={`flex w-full cursor-pointer items-center justify-between px-4 text-left outline-none ${shellClassName}`}
      >
        <span className={`truncate text-base ${selected ? "text-[#0B1C30]" : "text-[#6B7280]"}`}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown size={16} className="shrink-0 text-[#434655]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          {showSearch && (
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-3 py-2">
              <Search size={14} className="shrink-0 text-[#94A3B8]" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search locations…"
                className="w-full bg-transparent text-sm text-[#0B1C30] outline-none placeholder:text-[#94A3B8]"
              />
              <span className="shrink-0 text-xs text-[#94A3B8]">
                {filtered.length}/{locations.length}
              </span>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto py-1">
            {locations.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#94A3B8]">
                {isLoading ? "Loading locations…" : "No locations yet"}
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[#94A3B8]">
                Nothing matches &ldquo;{query}&rdquo;.
              </p>
            ) : (
              filtered.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => {
                    onChange(location.id);
                    closeDropdown();
                  }}
                  className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm text-[#0B1C30] ${
                    location.id === value ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span className="truncate">{location.name}</span>
                  {location.id === value && (
                    <Check size={14} stroke="#2563EB" strokeWidth={2.5} />
                  )}
                </button>
              ))
            )}
          </div>

          {canAdd && (
            <div className="border-t border-[#E2E8F0] p-2">
              {isAdding ? (
                <div className="flex items-center gap-1.5">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreate();
                      }
                    }}
                    placeholder="New location name"
                    className="h-8 flex-1 rounded-md border border-[#C3C6D7] bg-white px-2 text-sm text-[#0B1C30] outline-none focus:ring-2 focus:ring-[#325A5E]/30"
                  />
                  <button
                    type="button"
                    disabled={!newName.trim() || isSaving}
                    onClick={handleCreate}
                    className="flex h-8 shrink-0 cursor-pointer items-center rounded-md bg-[#376EF4] px-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "…" : "Add"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-2 text-left text-sm font-medium text-[#376EF4] transition-colors hover:bg-[#F0F9FF]"
                >
                  <Plus size={14} />
                  Add new location
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
