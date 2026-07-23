"use client";

// src/components/sharedComponents/ClientSelect.tsx
//
// Reusable searchable client combobox — type to filter, click to select.
// Used in: ScheduleSessionModal, AddFollowUpModal, RecordPaymentModal.
// All three modals share this single implementation; the optional
// labelClassName / shellClassName props let each modal apply its own
// palette without forking the component.
//
// Selected value is the client's `id` string (not the display name) so the
// rest of the app can reference the client by their stable identifier.

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { clientsService, type Client } from "@/src/services/clientsService";

export default function ClientSelect({
  label,
  value,
  onChange,
  labelClassName = "text-sm font-semibold leading-5 text-[#0F172A]",
  shellClassName = "h-13 rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)]",
}: {
  /** Label shown above the trigger field. */
  label: string;
  /** Currently selected client ID (empty string = nothing selected). */
  value: string;
  /** Called with the newly selected client's ID. */
  onChange: (id: string) => void;
  /** Optional override for the label element's className. */
  labelClassName?: string;
  /** Optional override for the trigger button's className. */
  shellClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    clientsService.fetchClients().then(setClients).catch(() => {});
  }, []);

  // Derived display name for the currently selected client
  const selectedClient = clients.find((c) => c.id === value) ?? null;
  const displayName = selectedClient?.name ?? "";

  // Filtered list based on current query
  const filtered = query.trim()
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : clients;

  // Open dropdown and focus the filter input
  function openDropdown() {
    setIsOpen(true);
    setQuery("");
    // Focus the hidden input on next tick so the panel has rendered
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeDropdown(revert = true) {
    setIsOpen(false);
    if (revert) setQuery("");
  }

  function selectClient(id: string) {
    onChange(id);
    closeDropdown(true);
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown(true);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDropdown(true);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>

      {/* ── Trigger ─────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={isOpen ? () => closeDropdown(true) : openDropdown}
        className={`flex w-full cursor-pointer items-center gap-3 px-4 text-left outline-none focus:border-2 focus:border-[#2563EB] ${shellClassName}`}
      >
        <span
          className={`min-w-0 flex-1 truncate text-base font-normal leading-6 ${
            displayName ? "text-[#0F172A]" : "text-[#94A3B8]"
          }`}
        >
          {displayName || "Select a client…"}
        </span>
        <ChevronDown
          size={18}
          stroke="#94A3B8"
          className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown panel ───────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
          {/* Search input */}
          <div className="border-b border-[#E2E8F0] px-3 py-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients…"
              className="w-full bg-transparent text-sm text-[#1E293B] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Options list */}
          <div className="max-h-[280px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#94A3B8]">
                No clients found
              </p>
            ) : (
              filtered.map((client) => {
                const isSelected = client.id === value;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => selectClient(client.id)}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[15px] text-[#1E293B] transition-colors ${
                      isSelected
                        ? "bg-[#EFF6FF]"
                        : "hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span className="min-w-0 flex-1 truncate">{client.name}</span>
                    {isSelected && (
                      <Check
                        size={14}
                        stroke="#2563EB"
                        strokeWidth={2.5}
                        className="ml-2 shrink-0"
                      />
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
