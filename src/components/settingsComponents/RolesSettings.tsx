import { rolesData } from "@/src/data/settingsData/rolesData";
import RoleCard from "@/src/sections/settingsSections/RoleCard";

export default function RolesSettings() {
  return (
    <div className="flex max-w-[630px] flex-col gap-4 rounded-[18px] border border-[#E0E5EB] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.06)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Roles &amp; Permissions
      </h3>
      <div className="flex flex-col gap-3">
        {rolesData.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
    </div>
  );
}

