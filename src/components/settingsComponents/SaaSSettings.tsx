"use client";

import { useState } from "react";
import { saasModulesData } from "@/src/data/settingsData/saasModulesData";
import ToggleRow from "@/src/sections/settingsSections/ToggleRow";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { isAdmin } from "@/src/lib/permissions";

// Static design UI — these modules aren't wired to a backend; there is
// nothing behind them yet to persist a toggle state to.
export default function SaaSSettings() {
  const { role } = useCurrentUser();
  const [modules, setModules] = useState(saasModulesData);

  function toggle(id: string) {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
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
        {modules.map((module) => (
          <ToggleRow
            key={module.id}
            label={module.label}
            enabled={module.enabled}
            onToggle={() => toggle(module.id)}
            disabled={!isAdmin(role)}
          />
        ))}
      </div>
    </div>
  );
}
