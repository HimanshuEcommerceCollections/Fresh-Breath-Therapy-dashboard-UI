"use client";

import { useState } from "react";
import ClientsHeader from "@/src/components/clientsComponents/ClientsHeader";
import ClientsToolbar from "@/src/components/clientsComponents/ClientsToolbar";
import ClientsTable from "@/src/components/clientsComponents/ClientsTable";
import LeadSearchSection from "@/src/sections/clientsSections/LeadSearchSection";
import EditClientModal from "@/src/sections/clientsSections/EditClientModal";
import ConfirmDeleteModal from "@/src/components/sharedComponents/ConfirmDeleteModal";
import type { Client } from "@/src/services/clientsService";
import { useClients } from "@/src/hooks/useClients";
import { useLocations } from "@/src/hooks/useLocations";

const ALL_LOCATIONS = "All locations";

export default function ClientsPage() {
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const { locations } = useLocations();
  const {
    clients,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    allClients,
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
    updateClient,
    deleteClient,
  } = useClients();

  const handleLocationNameChange = (name: string) => {
    setLocationName(name);
    setLocationId(name === ALL_LOCATIONS ? null : locations.find((l) => l.name === name)?.id ?? null);
  };

  if (isAddingClient) {
    return (
      <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
        <LeadSearchSection
          clientCount={allClients.length}
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
      <ClientsHeader count={allClients.length} onAddClient={openLeadSearch} />
      <ClientsToolbar
        search={search}
        onSearchChange={setSearch}
        locationName={locationName}
        onLocationNameChange={handleLocationNameChange}
      />
      <ClientsTable
        clients={clients}
        isLoading={isLoading}
        onEdit={setEditingClient}
        onDelete={setDeletingClient}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onUpdate={updateClient}
        />
      )}

      {deletingClient && (
        <ConfirmDeleteModal
          title="Delete client?"
          message={`Are you sure you want to delete ${deletingClient.name}? This cannot be undone.`}
          onCancel={() => setDeletingClient(null)}
          onConfirm={async () => {
            await deleteClient(deletingClient.id);
            setDeletingClient(null);
          }}
        />
      )}
    </div>
  );
}
