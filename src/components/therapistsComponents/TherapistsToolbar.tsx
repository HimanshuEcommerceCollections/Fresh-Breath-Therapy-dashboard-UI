"use client";

import { useState } from "react";
import SearchInput from "@/src/sections/leadsSections/SearchInput";
import LocationFilterCombobox from "@/src/sections/leadsSections/LocationFilterCombobox";
import { locationOptions } from "@/src/data/leadsData/locationOptions";

export default function TherapistsToolbar() {
  // Local input state only — actual search filtering will be wired up later.
  const [query, setQuery] = useState("");

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search therapists…"
        />
        <LocationFilterCombobox
          options={["All locations", ...locationOptions]}
          widthClass="w-48"
        />
      </div>
    </div>
  );
}
