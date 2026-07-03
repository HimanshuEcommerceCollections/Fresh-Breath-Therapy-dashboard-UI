"use client";

import { useState } from "react";
import { organizationData } from "@/src/data/settingsData/organizationData";
import SettingsField from "@/src/sections/settingsSections/SettingsField";
import LocationChip from "@/src/sections/settingsSections/LocationChip";

export default function OrganizationSettings() {
  // Controlled/editable, initialized from data — no save action exists in
  // the reference yet; submit wiring is a follow-up once clarified.
  const [name, setName] = useState(organizationData.name);
  const [primaryEmail, setPrimaryEmail] = useState(organizationData.primaryEmail);
  const [timezone, setTimezone] = useState(organizationData.timezone);

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

      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Locations ({organizationData.locations.length})
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {organizationData.locations.map((location) => (
          <LocationChip key={location} location={location} />
        ))}
      </div>
    </div>
  );
}
