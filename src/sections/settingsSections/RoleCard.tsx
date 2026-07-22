import type { Role } from "@/src/data/settingsData/rolesData";

export default function RoleCard({ role }: { role: Role }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] border border-[#E2E8F0] p-4 transition-colors">
      <span className="text-[15px] font-semibold text-[#071123]">{role.name}</span>
      <span className="text-[13px] font-normal text-[#596475]">
        {role.permissions}
      </span>
    </div>
  );
}

