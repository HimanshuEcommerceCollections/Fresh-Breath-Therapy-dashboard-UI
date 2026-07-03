import type { Role } from "@/src/data/settingsData/rolesData";

export default function RoleCard({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-1 rounded-[4px] border border-[rgba(224,229,235,0.6)] p-3">
      <span className="text-sm font-semibold text-[#071123]">{role.name}</span>
      <span className="text-[11px] font-normal text-[#596475]">
        {role.permissions}
      </span>
    </div>
  );
}
