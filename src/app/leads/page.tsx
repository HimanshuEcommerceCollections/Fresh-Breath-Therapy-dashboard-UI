"use client";

import { useState } from "react";
import LeadsPageHeader from "@/src/components/leadsComponents/LeadsPageHeader";
import LeadsToolbar from "@/src/components/leadsComponents/LeadsToolbar";
import LeadsTable from "@/src/components/leadsComponents/LeadsTable";
import LeadsPipelineBoard from "@/src/components/leadsComponents/LeadsPipelineBoard";
import AddLeadModal from "@/src/sections/leadsSections/AddLeadModal";
import ConfirmDeleteModal from "@/src/components/sharedComponents/ConfirmDeleteModal";
import type { LeadsView } from "@/src/sections/leadsSections/ViewToggleTabs";
import type { Lead } from "@/src/services/leadsService";
import { useLeads } from "@/src/hooks/useLeads";
import { useLocations } from "@/src/hooks/useLocations";

const ALL_LOCATIONS = "All locations";

export default function LeadsPage() {
  const [activeView, setActiveView] = useState<LeadsView>("table");
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const { locations } = useLocations();
  const {
    leads,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    setLocationId,
    createLead,
    updateLead,
    deleteLead,
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
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          onEdit={setEditingLead}
          onDelete={setDeletingLead}
        />
      ) : (
        <LeadsPipelineBoard leads={leads} />
      )}

      {editingLead && (
        <AddLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onCreate={createLead}
          onUpdate={updateLead}
        />
      )}

      {deletingLead && (
        <ConfirmDeleteModal
          title="Delete lead?"
          message={`Are you sure you want to delete ${deletingLead.name}? This cannot be undone.`}
          onCancel={() => setDeletingLead(null)}
          onConfirm={async () => {
            await deleteLead(deletingLead.id);
            setDeletingLead(null);
          }}
        />
      )}
    </div>
  );
}
