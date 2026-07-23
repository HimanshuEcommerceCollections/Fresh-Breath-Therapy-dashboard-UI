"use client";

import { useFeatureFlags } from "@/src/hooks/useFeatureFlags";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";

export default function AutomationSettings() {
  const { flags, toggle } = useFeatureFlags("automation");

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Automation Rules
      </h3>
      <div className="flex flex-col divide-y divide-[#E0E5EB]">
        {flags.map((flag) => (
          <ToggleRow
            key={flag.id}
            label={flag.label}
            enabled={flag.enabled}
            onToggle={() => toggle(flag.id, !flag.enabled)}
          />
        ))}
      </div>
    </div>
  );
}
