"use client";

import { useState } from "react";
import { saasModulesData } from "@/src/data/settingsData/saasModulesData";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";

export default function SaaSSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(saasModulesData.map((m) => [m.id, m.enabled])),
  );

  function toggle(id: string) {
    // TODO: persist to backend.
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Future SaaS Modules
      </h3>
      <p className="text-xs font-normal text-[#596475]">
        Architecture is multi-tenant ready. Toggle modules as they roll out.
      </p>
      <div className="mt-1 flex flex-col divide-y divide-[#E0E5EB]">
        {saasModulesData.map((mod) => (
          <ToggleRow
            key={mod.id}
            label={mod.label}
            enabled={enabled[mod.id]}
            onToggle={() => toggle(mod.id)}
          />
        ))}
      </div>
    </div>
  );
}
