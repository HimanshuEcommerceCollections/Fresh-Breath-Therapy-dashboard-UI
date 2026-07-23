"use client";

import { useState } from "react";
import LeadsPageHeader from "@/src/components/leadsComponents/LeadsPageHeader";
import LeadsToolbar from "@/src/components/leadsComponents/LeadsToolbar";
import LeadsTable from "@/src/components/leadsComponents/LeadsTable";
import LeadsPipelineBoard from "@/src/components/leadsComponents/LeadsPipelineBoard";
import type { LeadsView } from "@/src/sections/leadsSections/ViewToggleTabs";
import { useLeads } from "@/src/hooks/useLeads";
import { useLocations } from "@/src/hooks/useLocations";

const ALL_LOCATIONS = "All locations";

export default function LeadsPage() {
  const [activeView, setActiveView] = useState<LeadsView>("table");
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);
  const { locations } = useLocations();
  const {
    leads,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    setLocationId,
    createLead,
  } = useLeads();

  const handleLocationNameChange = (name: string) => {
    setLocationName(name);
    setLocationId(name === ALL_LOCATIONS ? null : locations.find((l) => l.name === name)?.id ?? null);
  };

  return (
    <div className="flex flex-col gap-6 px-8 pb-12 pt-24">
      <LeadsPageHeader leads={leads} onCreate={createLead} />
      <LeadsToolbar
        activeView={activeView}
        onViewChange={setActiveView}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        locationName={locationName}
        onLocationNameChange={handleLocationNameChange}
      />
      {activeView === "table" ? (
        <LeadsTable leads={leads} />
      ) : (
        <LeadsPipelineBoard leads={leads} />
      )}
    </div>
  );
}
