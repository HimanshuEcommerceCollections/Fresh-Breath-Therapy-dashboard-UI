"use client";

import SearchInput from "@/src/sections/leadsSections/SearchInput";
import LocationFilterCombobox from "@/src/sections/leadsSections/LocationFilterCombobox";
import { useLocations } from "@/src/hooks/useLocations";

const ALL_LOCATIONS = "All locations";

export default function ClientsToolbar({
  search,
  onSearchChange,
  locationName,
  onLocationNameChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  locationName: string;
  onLocationNameChange: (value: string) => void;
}) {
  const { locations } = useLocations();

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-center gap-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search clients…"
        />
        <LocationFilterCombobox
          options={[ALL_LOCATIONS, ...locations.map((l) => l.name)]}
          widthClass="w-48"
          value={locationName}
          onChange={onLocationNameChange}
        />
      </div>
    </div>
  );
}
