"use client";

// src/components/sessionsComponents/TherapistFilterDropdown.tsx
//
// Pill button that opens a 320px dropdown for filtering sessions by therapist.
// Used in SessionsPageHeader (shared by all four views). All filter state lives
// in useSessionsPage — this component is fully controlled (no local open/close).

import { useEffect, useRef } from "react";
import { Check, ChevronDown, Users } from "lucide-react";
import type { Therapist } from "@/src/services/therapistsService";

// 6-colour avatar palette, cycled by therapist index in the roster.
const AVATAR_PALETTE: { bg: string; text: string }[] = [
  { bg: "#DBEAFE", text: "#1447E6" },
  { bg: "#D0FAE5", text: "#007A55" },
  { bg: "#FEF3C6", text: "#BB4D00" },
  { bg: "#FFE4E6", text: "#C70036" },
  { bg: "#EDE9FE", text: "#7008E7" },
  { bg: "#CBFBF1", text: "#00786F" },
];

function getAvatarColor(index: number) {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TherapistFilterDropdown({
  // Committed filter state
  therapistFilterLabel,
  isAllTherapists,
  selectedTherapistIds,
  // Dropdown open state
  isDropdownOpen,
  onOpen,
  onClose,
  // Search
  therapistSearch,
  onSearchChange,
  // Pending interaction
  pendingIds,
  onTogglePending,
  onSelectAll,
  onReset,
  onApply,
  // Therapist roster (already filtered by search inside the hook)
  filteredTherapists,
}: {
  therapistFilterLabel: string;
  isAllTherapists: boolean;
  selectedTherapistIds: string[];
  isDropdownOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  therapistSearch: string;
  onSearchChange: (v: string) => void;
  pendingIds: string[];
  onTogglePending: (id: string) => void;
  onSelectAll: () => void;
  onReset: () => void;
  onApply: () => void;
  filteredTherapists: Therapist[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isDropdownOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isDropdownOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      {/* ── Pill trigger ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={isDropdownOpen ? onClose : onOpen}
        style={{ height: 40 }}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3.5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-md"
      >
        <Users size={14} stroke="#314158" strokeWidth={2} />
        <span
          style={{ fontSize: "12.8px", fontWeight: 600 }}
          className="text-[#314158]"
        >
          {therapistFilterLabel}
        </span>
        <ChevronDown
          size={14}
          stroke="#90A1B9"
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown panel ────────────────────────────────────────────── */}
      {isDropdownOpen && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 flex flex-col overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
          style={{ width: 320 }}
        >
          {/* Search */}
          <div className="px-3 pt-3 pb-2">
            <input
              type="text"
              value={therapistSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search therapists..."
              style={{ fontSize: "12.5px" }}
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[#62748E] outline-none placeholder:text-[#62748E] focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]/20"
            />
          </div>

          {/* "All Therapists" row */}
          <button
            type="button"
            onClick={onSelectAll}
            className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-[#F8FAFC]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF4FA]">
              <Users size={14} stroke="#314158" strokeWidth={2} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span
                style={{ fontSize: "12.8px", fontWeight: 600 }}
                className="text-[#0F172B]"
              >
                All Therapists
              </span>
              <span style={{ fontSize: "10.9px" }} className="text-[#62748E]">
                Show sessions for everyone
              </span>
            </div>
            {pendingIds.length === 0 && (
              <Check size={14} stroke="#155DFC" strokeWidth={2.5} />
            )}
          </button>

          {/* Separator */}
          <div className="mx-3 border-t border-[#E2E8F0]" />

          {/* Team label */}
          <div className="px-3 pt-2 pb-1">
            <span
              style={{
                fontSize: "10.9px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              className="text-[#62748E]"
            >
              Team
            </span>
          </div>

          {/* Therapist rows */}
          <div className="max-h-[280px] overflow-y-auto">
            {filteredTherapists.map((therapist, index) => {
              const color = getAvatarColor(index);
              const checked = pendingIds.includes(therapist.id);
              return (
                <button
                  key={therapist.id}
                  type="button"
                  onClick={() => onTogglePending(therapist.id)}
                  className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-[#F8FAFC]"
                >
                  {/* Avatar */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {getInitials(therapist.name)}
                  </div>

                  {/* Name + role */}
                  <div className="flex min-w-0 flex-1 flex-col text-left">
                    <span
                      style={{ fontSize: "13.1px", fontWeight: 600 }}
                      className="truncate text-[#020618]"
                    >
                      {therapist.name}
                    </span>
                    <span
                      style={{ fontSize: "10.9px" }}
                      className="truncate text-[#62748E]"
                    >
                      {therapist.credential ? `${therapist.credential} · ` : ""}
                      {therapist.location.name}
                    </span>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[8px] border transition-colors ${
                      checked
                        ? "border-[#155DFC] bg-[#155DFC]"
                        : "border-[#CAD5E2] bg-white"
                    }`}
                  >
                    {checked && (
                      <Check size={11} stroke="white" strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              );
            })}

            {filteredTherapists.length === 0 && (
              <p
                style={{ fontSize: "12.5px" }}
                className="px-3 py-4 text-center text-[#62748E]"
              >
                No therapists found
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#E2E8F0] px-3 py-2.5">
            <button
              type="button"
              onClick={onReset}
              style={{ fontSize: "10.7px" }}
              className="cursor-pointer text-[#62748E] transition-colors hover:text-[#0F172B]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onApply}
              className="cursor-pointer rounded-[8px] bg-[#155DFC] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
