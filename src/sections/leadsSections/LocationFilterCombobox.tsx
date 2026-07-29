"use client";

import { useState } from "react";
import LocationSelectionMenu from "@/src/sections/leadsSections/LocationSelectionMenu";
import { useLocations } from "@/src/hooks/useLocations";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";

const ALL_LOCATIONS = "All locations";

// Shared location filter combobox (Leads, Clients, Therapists, Reports
// toolbars). Sources the real locations list itself via useLocations() —
// callers just pass value/onChange for the selected filter, they no longer
// need to build the options list.
//
// For Admin, this also doubles as the locations management UI: "+ Add
// Location" creates one via POST /api/locations, and each row gets a
// delete action (with confirmation) via DELETE /api/locations/:id — per the
// permission matrix, Locations are Admin full R/W, Coordinator/Therapist
// read-only, so non-admins just see the plain filter list.
export default function LocationFilterCombobox({
  widthClass,
  value,
  onChange,
}: {
  widthClass: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const { locations, createLocation, deleteLocation } = useLocations();
  const { role } = useCurrentUser();
  const [internalSelected, setInternalSelected] = useState(ALL_LOCATIONS);
  const selected = value ?? internalSelected;
  const setSelected = onChange ?? setInternalSelected;
  const [isOpen, setIsOpen] = useState(false);

  async function handleDeleteLocation(locationId: string) {
    const deletedName = locations.find((l) => l.id === locationId)?.name;
    await deleteLocation(locationId);
    // The deleted location can no longer be a valid filter selection.
    if (deletedName && deletedName === selected) {
      setSelected(ALL_LOCATIONS);
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-9 cursor-pointer items-center justify-between rounded-xl border border-[#E0E5EB] bg-white px-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] ${widthClass}`}
      >
        <span className="truncate text-sm font-normal text-[#071123]">
          {selected}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="shrink-0 opacity-50"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="#071123"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <LocationSelectionMenu
          locations={locations}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setIsOpen(false)}
          canManage={isAdmin(role)}
          onCreateLocation={createLocation}
          onDeleteLocation={handleDeleteLocation}
        />
      )}
    </div>
  );
}
