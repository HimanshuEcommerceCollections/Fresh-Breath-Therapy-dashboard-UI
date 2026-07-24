"use client";

import { useState } from "react";
import ClientsHeader from "@/src/components/clientsComponents/ClientsHeader";
import ClientsToolbar from "@/src/components/clientsComponents/ClientsToolbar";
import ClientsTable from "@/src/components/clientsComponents/ClientsTable";
import LeadSearchSection from "@/src/sections/clientsSections/LeadSearchSection";
import { useClients } from "@/src/hooks/useClients";
import { useLocations } from "@/src/hooks/useLocations";

const ALL_LOCATIONS = "All locations";

export default function ClientsPage() {
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);
  const { locations } = useLocations();
  const {
    clients,
    search,
    setSearch,
    setLocationId,
    isAddingClient,
    openLeadSearch,
    cancelLeadSearch,
    leadSearchQuery,
    setLeadSearchQuery,
    filteredLeads,
    convertingLeadId,
    convertedLeadIds,
    handleAddLead,
  } = useClients();

  const handleLocationNameChange = (name: string) => {
    setLocationName(name);
    setLocationId(name === ALL_LOCATIONS ? null : locations.find((l) => l.name === name)?.id ?? null);
  };

  if (isAddingClient) {
    return (
      <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
        <LeadSearchSection
          clientCount={clients.length}
          searchQuery={leadSearchQuery}
          onSearchQueryChange={setLeadSearchQuery}
          leads={filteredLeads}
          onCancel={cancelLeadSearch}
          onAddLead={handleAddLead}
          convertingLeadId={convertingLeadId}
          convertedLeadIds={convertedLeadIds}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <ClientsHeader count={clients.length} onAddClient={openLeadSearch} />
      <ClientsToolbar
        search={search}
        onSearchChange={setSearch}
        locationName={locationName}
        onLocationNameChange={handleLocationNameChange}
      />
      <ClientsTable clients={clients} />
    </div>
  );
}
