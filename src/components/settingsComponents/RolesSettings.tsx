"use client";

import { useEffect, useState } from "react";
import { rolesService, type SettingsRole } from "@/src/services/settingsService";
import RoleCard from "@/src/sections/settingsSections/RoleCard";

// MISMATCH: the real Role.permissions object has no documented shape, so
// these human-readable descriptions stay as fixed local copy (matching
// section 16's own written Permission Matrix) rather than being derived
// from the opaque API object — see settingsService.ts's top-of-file note.
const PERMISSION_DESCRIPTIONS: Record<SettingsRole["name"], string> = {
  Admin: "Full access · Manage team · Reports · Revenue · Settings",
  Coordinator: "Full access for reading only not writing",
  Therapist: "Only their own clients and sessions, also PTO",
};

export default function RolesSettings() {
  const [roles, setRoles] = useState<SettingsRole[]>([]);

  useEffect(() => {
    rolesService.fetchRoles().then(setRoles).catch(() => {});
  }, []);

  return (
    <div className="flex max-w-[630px] flex-col gap-4 rounded-[18px] border border-[#E0E5EB] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Roles &amp; Permissions
      </h3>
      <div className="flex flex-col gap-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={{ name: role.name, permissions: PERMISSION_DESCRIPTIONS[role.name] }}
          />
        ))}
      </div>
    </div>
  );
}
