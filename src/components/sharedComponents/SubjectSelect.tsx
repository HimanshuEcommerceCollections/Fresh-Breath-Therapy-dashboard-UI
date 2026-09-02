"use client";

// src/components/sharedComponents/SubjectSelect.tsx
//
// Picks the person a session is for: a client (default) or a lead.
//
// A toggle rather than one combined list. Searching both tables at once would
// mean loading both on every open, and the admin already knows which kind of
// record they are booking for — so the toggle costs one click and saves a
// whole table's worth of fetching. Only the selected side is queried; the
// other stays `enabled: false`.
//
// Replaces ClientSelect inside the Schedule Session modal. ClientSelect stays
// for Follow-Ups, which genuinely are client-only.

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { clientsService } from "@/src/services/clientsService";
import { leadsService } from "@/src/services/leadsService";
import type { SubjectKind } from "@/src/services/sessionsService";

export type SubjectValue = { id: string; kind: SubjectKind } | null;

export default function SubjectSelect({
  label,
  value,
  onChange,
  locked = false,
  lockedName,
  labelClassName = "text-sm font-semibold leading-5 text-[#0F172A]",
  shellClassName = "h-13 rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)]",
}: {
  label: string;
  value: SubjectValue;
  onChange: (next: SubjectValue) => void;
  /** Renders as a read-only field. Used when the modal was opened for one
   *  specific person and changing them would defeat the point. */
  locked?: boolean;
  /** Name to display while locked — the person may not be in the cached list
   *  yet if they were created seconds ago. */
  lockedName?: string;
  labelClassName?: string;
  shellClassName?: string;
}) {
  const [kind, setKind] = useState<SubjectKind>(value?.kind ?? "client");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keys shared with the Clients and Leads pages, so the list is usually warm
  // by the time this opens. Only the active side runs.
  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["clients", "all", {}],
    queryFn: () => clientsService.fetchAllClients(),
    staleTime: 60_000,
    enabled: !locked && kind === "client",
  });
  const { data: leads = [], isLoading: loadingLeads } = useQuery({
    queryKey: ["leads", "all", {}],
    queryFn: () => leadsService.fetchAllLeads(),
    staleTime: 60_000,
    enabled: !locked && kind === "lead",
  });

  const people = kind === "client" ? clients : leads;
  const isLoading = kind === "client" ? loadingClients : loadingLeads;

  const selectedName =
    lockedName ?? (value ? people.find((p) => p.id === value.id)?.name ?? "" : "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => p.name.toLowerCase().includes(q));
  }, [people, query]);

  function openDropdown() {
    setIsOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  useEffect(() => {
    if (!isOpen) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (locked) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className={labelClassName}>{label}</span>
        <div className={`flex w-full items-center gap-2 px-4 opacity-90 ${shellClassName}`}>
          <span className="min-w-0 flex-1 truncate text-base text-[#0F172A]">
            {selectedName}
          </span>
          <span className="shrink-0 rounded-full bg-[#E8EDF4] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.4px] text-[#596475]">
            {value?.kind ?? "client"}
          </span>
        </div>
      </div>
    );
  }

  function switchKind(next: SubjectKind) {
    if (next === kind) return;
    setKind(next);
    setQuery("");
    // Clear the selection: an id from the other table would submit as the
    // wrong person entirely, and silently keeping it is worse than making the
    // admin pick again.
    onChange(null);
  }

  const tabBase =
    "flex-1 cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold tracking-[0.4px] transition-colors";

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className={labelClassName}>{label}</span>
        <div className="flex w-40 gap-1 rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] p-1">
          {(["client", "lead"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => switchKind(k)}
              aria-pressed={kind === k}
              className={`${tabBase} ${
                kind === k
                  ? "bg-white text-[#0F172A] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                  : "text-[#94A3B8] hover:text-[#596475]"
              }`}
            >
              {k === "client" ? "Clients" : "Leads"}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : openDropdown}
        className={`flex w-full cursor-pointer items-center gap-3 px-4 text-left outline-none focus:border-2 focus:border-[#2563EB] ${shellClassName}`}
      >
        <span
          className={`min-w-0 flex-1 truncate text-base font-normal leading-6 ${
            selectedName ? "text-[#0F172A]" : "text-[#94A3B8]"
          }`}
        >
          {selectedName || (kind === "client" ? "Select a client…" : "Select a lead…")}
        </span>
        <ChevronDown
          size={18}
          stroke="#94A3B8"
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#E2E8F0] px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={kind === "client" ? "Search clients…" : "Search leads…"}
              className="w-full bg-transparent text-sm text-[#1E293B] outline-none placeholder:text-[#94A3B8]"
            />
          </div>
          <div className="max-h-[280px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#94A3B8]">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Loading {kind === "client" ? "clients" : "leads"}…
                  </span>
                ) : (
                  `No ${kind === "client" ? "clients" : "leads"} found`
                )}
              </p>
            ) : (
              filtered.map((person) => {
                const isSelected = person.id === value?.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      onChange({ id: person.id, kind });
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[15px] text-[#1E293B] transition-colors ${
                      isSelected ? "bg-[#EFF6FF]" : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{person.name}</span>
                    {isSelected && (
                      <Check size={14} stroke="#2563EB" strokeWidth={2.5} className="ml-2 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
