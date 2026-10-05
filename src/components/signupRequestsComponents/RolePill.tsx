// RolePill — static colored pill showing an already-assigned role.
// Read-only: the role is assigned at approval and changed afterward through
// ApproveRequestModal in "change" mode, never by editing the pill itself.

import {
  roleStyleConfig,
  defaultRoleStyle,
} from "@/src/data/signupRequestsData/signupRequestsData";

export default function RolePill({ roleName }: { roleName: string }) {
  const style = roleStyleConfig[roleName] ?? defaultRoleStyle;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
      style={{ background: style.bg, borderColor: style.border, color: style.text }}
    >
      {roleName}
    </span>
  );
}
