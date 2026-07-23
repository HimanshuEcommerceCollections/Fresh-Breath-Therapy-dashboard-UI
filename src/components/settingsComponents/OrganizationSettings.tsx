"use client";

import { useEffect, useState } from "react";
import { useOrganizationSettings } from "@/src/hooks/useOrganizationSettings";
import { useLocations } from "@/src/hooks/useLocations";
import SettingsField from "@/src/sections/settingsSections/SettingsField";
import LocationChip from "@/src/sections/settingsSections/LocationChip";

export default function OrganizationSettings() {
  const { organization, isSaving, save } = useOrganizationSettings();
  const { locations } = useLocations();

  const [name, setName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");

  // Sync form fields once the real organization loads (fields start empty
  // until then, since there may be no organization row yet — section 14.1).
  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setPrimaryEmail(organization.primaryEmail);
      setTimezone(organization.timezone);
    }
  }, [organization]);

  return (
    <div className="flex max-w-[630px] flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Organization
      </h3>

      <SettingsField label="Organization Name" value={name} onChange={setName} />
      <SettingsField
        label="Primary Email"
        value={primaryEmail}
        onChange={setPrimaryEmail}
        type="email"
      />
      {/* Plain text input for now — a real timezone select is a future enhancement. */}
      <SettingsField label="Timezone" value={timezone} onChange={setTimezone} />

      <button
        type="button"
        disabled={!name || !primaryEmail || isSaving}
        onClick={() => save({ name, primaryEmail, timezone })}
        className="self-start rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSaving ? "Saving…" : "Save"}
      </button>

      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Locations ({locations.length})
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {locations.map((location) => (
          <LocationChip key={location.id} location={location.name} />
        ))}
      </div>
    </div>
  );
}
