"use client";

import { useState } from "react";
import { notificationSettingsData } from "@/src/data/settingsData/notificationSettingsData";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";

export default function NotificationsSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationSettingsData.map((n) => [n.id, n.enabled])),
  );

  function toggle(id: string) {
    // TODO: persist to backend.
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Notifications
      </h3>
      <div className="flex flex-col divide-y divide-[#E0E5EB]">
        {notificationSettingsData.map((setting) => (
          <ToggleRow
            key={setting.id}
            label={setting.label}
            enabled={enabled[setting.id]}
            onToggle={() => toggle(setting.id)}
          />
        ))}
      </div>
    </div>
  );
}
