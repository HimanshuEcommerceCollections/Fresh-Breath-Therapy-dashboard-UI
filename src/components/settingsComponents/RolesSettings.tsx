"use client";

import { useEffect, useState } from "react";
import { rolesService, type SettingsRole } from "@/src/services/settingsService";
import RoleCard from "@/src/sections/settingsSections/RoleCard";
import { Skeleton } from "@/src/components/ui/Skeleton";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    rolesService
      .fetchRoles()
      .then(setRoles)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex max-w-[630px] flex-col gap-4 rounded-[18px] border border-[#E0E5EB] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Roles &amp; Permissions
      </h3>
      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-[10px] border border-[#E2E8F0] p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-56" />
              </div>
            ))
          : roles.map((role) => (
              <RoleCard
                key={role.id}
                role={{ name: role.name, permissions: PERMISSION_DESCRIPTIONS[role.name] }}
              />
            ))}
      </div>
    </div>
  );
}
