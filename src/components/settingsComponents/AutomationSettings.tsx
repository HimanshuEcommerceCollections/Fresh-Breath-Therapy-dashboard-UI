"use client";

import { useState } from "react";
import { automationRulesData } from "@/src/data/settingsData/automationRulesData";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";

export default function AutomationSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(automationRulesData.map((r) => [r.id, r.enabled])),
  );

  function toggle(id: string) {
    // TODO: persist to backend.
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Automation Rules
      </h3>
      <div className="flex flex-col divide-y divide-[#E0E5EB]">
        {automationRulesData.map((rule) => (
          <ToggleRow
            key={rule.id}
            label={rule.label}
            enabled={enabled[rule.id]}
            onToggle={() => toggle(rule.id)}
          />
        ))}
      </div>
    </div>
  );
}
