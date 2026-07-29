"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Location } from "@/src/services/locationsService";

function CheckmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M2.5 7.5L5.5 10.5L11.5 3.5"
        stroke="#0F172A"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ALL_LOCATIONS = "All locations";

// Floating location option menu used by the toolbar's location filter.
// Admin-only: doubles as a small management UI — add a location, or delete
// one (with confirmation, since deletion is irreversible and the backend
// rejects it outright if any Therapist/Client is still assigned).
export default function LocationSelectionMenu({
  locations,
  selected,
  onSelect,
  onClose,
  canManage,
  onCreateLocation,
  onDeleteLocation,
}: {
  locations: Location[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  canManage: boolean;
  onCreateLocation: (name: string) => Promise<Location>;
  onDeleteLocation: (locationId: string) => Promise<void>;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setIsSubmittingAdd(true);
    try {
      await onCreateLocation(name);
      setNewName("");
      setIsAdding(false);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsSubmittingAdd(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteLocation(confirmDelete.id);
      setConfirmDelete(null);
    } catch {
      // Error toast already surfaced by the apiClient interceptor — this is
      // where the backend's 400 ("location has assigned Therapists/Clients")
      // reaches the user, verbatim, rather than a generic failure message.
      setConfirmDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  if (confirmDelete) {
    return (
      <div
        ref={panelRef}
        className="absolute left-0 top-full z-30 mt-1 flex w-56 flex-col gap-2 rounded-[5px] bg-white p-3 shadow-[0px_6.5px_10px_-2px_rgba(0,0,0,0.1),0px_2.5px_4px_-1px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(0,0,0,0.05)]"
      >
        <p className="text-[13px] font-medium text-[#0F172A]">
          Delete {confirmDelete.name}? This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            disabled={isDeleting}
            className="flex-1 cursor-pointer rounded-[4px] border border-[#E2E8F0] px-2.5 py-1.5 text-xs font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex-1 cursor-pointer rounded-[4px] bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-30 mt-1 flex w-[173px] flex-col gap-[3px] rounded-[5px] bg-white p-[5px] shadow-[0px_6.5px_10px_-2px_rgba(0,0,0,0.1),0px_2.5px_4px_-1px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(0,0,0,0.05)]"
    >
      {canManage &&
        (isAdding ? (
          <div className="flex flex-col gap-1.5 p-1">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="Location name"
              className="rounded-[4px] border border-[#E2E8F0] px-2 py-1.5 text-[13px] outline-none focus:ring-2 focus:ring-[#376EF4]/30"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                }}
                disabled={isSubmittingAdd}
                className="flex-1 cursor-pointer rounded-[4px] border border-[#E2E8F0] px-2 py-1 text-xs font-medium text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || isSubmittingAdd}
                className="flex-1 cursor-pointer rounded-[4px] bg-[#376EF4] px-2 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {isSubmittingAdd ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full cursor-pointer items-center gap-1.5 rounded-[4px] px-2.5 py-2 text-left text-[13px] font-medium text-[#376EF4] hover:bg-slate-50"
          >
            <Plus size={14} strokeWidth={2} />
            Add Location
          </button>
        ))}

      <button
        type="button"
        onClick={() => {
          onSelect(ALL_LOCATIONS);
          onClose();
        }}
        className={`flex w-full cursor-pointer items-center justify-between rounded-[4px] px-2.5 py-2 text-left text-[13px] font-medium text-[#0F172A] ${
          selected === ALL_LOCATIONS ? "bg-[#EFF6FF]" : "hover:bg-slate-50"
        }`}
      >
        <span className="truncate">{ALL_LOCATIONS}</span>
        {selected === ALL_LOCATIONS && <CheckmarkIcon />}
      </button>

      {locations.map((location) => (
        <div
          key={location.id}
          className={`group flex w-full items-center justify-between rounded-[4px] px-2.5 py-2 text-[13px] font-medium text-[#0F172A] ${
            location.name === selected ? "bg-[#EFF6FF]" : "hover:bg-slate-50"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              onSelect(location.name);
              onClose();
            }}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
          >
            <span className="truncate">{location.name}</span>
            {location.name === selected && <CheckmarkIcon />}
          </button>
          {canManage && (
            <button
              type="button"
              aria-label={`Delete ${location.name}`}
              onClick={() => setConfirmDelete(location)}
              className="shrink-0 cursor-pointer rounded p-1 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
