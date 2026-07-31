"use client";

import { useState } from "react";
import { notificationSettingsData } from "@/src/data/settingsData/notificationSettingsData";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";

// Static design UI — not backed by an API, same as the SaaS and Security
// tabs. Toggling here is local-only and doesn't persist.
export default function NotificationsSettings() {
  const { role } = useCurrentUser();
  const [settings, setSettings] = useState(notificationSettingsData);

  function toggle(id: string) {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  return (
    <div className="flex max-w-[630px] flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Notifications
      </h3>
      <div className="flex flex-col divide-y divide-[#E0E5EB]">
        {settings.map((setting) => (
          <ToggleRow
            key={setting.id}
            label={setting.label}
            enabled={setting.enabled}
            onToggle={() => toggle(setting.id)}
            disabled={!isAdmin(role)}
          />
        ))}
      </div>
    </div>
  );
}
