"use client";

import ClientsHeader from "@/src/components/clientsComponents/ClientsHeader";
import ClientsToolbar from "@/src/components/clientsComponents/ClientsToolbar";
import ClientsTable from "@/src/components/clientsComponents/ClientsTable";
import LeadSearchSection from "@/src/sections/clientsSections/LeadSearchSection";
import { useClients } from "@/src/hooks/useClients";

export default function ClientsPage() {
  const {
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

  if (isAddingClient) {
    return (
      <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
        <LeadSearchSection
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
      <ClientsHeader onAddClient={openLeadSearch} />
      <ClientsToolbar />
      <ClientsTable />
    </div>
  );
}
