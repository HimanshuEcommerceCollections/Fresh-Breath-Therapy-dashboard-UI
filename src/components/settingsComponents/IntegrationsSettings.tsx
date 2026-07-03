import { integrationsData } from "@/src/data/settingsData/integrationsData";
import IntegrationCard from "@/src/sections/settingsSections/IntegrationCard";

// Wider than the other settings cards — 2-column grid per the reference
// (the one layout outlier among the settings tabs).
export default function IntegrationsSettings() {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
        Integrations
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {integrationsData.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
