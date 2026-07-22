"use client";

// RolePill — a colored interactive pill that opens the shared Select dropdown.
// Each role has its own background/border/text per the spec; the pill acts as
// the trigger for the Select component (triggerClassName + hideLabel props).

import Select from "@/src/components/sharedComponents/Select";
import {
  type SignupRequestRole,
  roleOptions,
  roleStyleConfig,
} from "@/src/data/signupRequestsData/signupRequestsData";

export default function RolePill({
  role,
  onChange,
}: {
  role: SignupRequestRole;
  onChange: (role: SignupRequestRole) => void;
}) {
  const style = roleStyleConfig[role];

  // Build the pill trigger class using the current role's color tokens.
  const triggerClass = [
    "relative flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1",
    "text-xs font-semibold outline-none transition-opacity hover:opacity-80",
  ].join(" ");

  return (
    <div className="relative inline-block">
      <Select
        label="Role"
        placeholder="Select role"
        options={roleOptions}
        value={role}
        onChange={(v) => onChange(v as SignupRequestRole)}
        hideLabel
        triggerClassName={triggerClass}
      />
      {/* Overlay the pill content on top of Select's own trigger text */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center gap-1.5 rounded-full border px-3"
        style={{
          background: style.bg,
          borderColor: style.border,
          color: style.text,
        }}
      >
        <span className="text-xs font-semibold">{role}</span>
        <svg
          width="10"
          height="7"
          viewBox="0 0 12 8"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
