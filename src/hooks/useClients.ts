// src/hooks/useClients.ts
"use client";

import { useMemo, useState } from "react";
import { leadsData, type Lead } from "@/src/data/leadsData/leadsData";
import { clientsService } from "@/src/services/clientsService";

export const useClients = () => {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const [convertedLeadIds, setConvertedLeadIds] = useState<Set<string>>(new Set());

  const openLeadSearch = () => setIsAddingClient(true);
  const cancelLeadSearch = () => {
    setIsAddingClient(false);
    setLeadSearchQuery("");
  };

  const filteredLeads = useMemo(() => {
    const query = leadSearchQuery.trim().toLowerCase();
    if (!query) return leadsData;
    return leadsData.filter((lead: Lead) =>
      [lead.name, lead.email, lead.phone].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [leadSearchQuery]);

  const handleAddLead = async (leadId: string) => {
    setConvertingLeadId(leadId);
    try {
      const res = await clientsService.convertLeadToClient(leadId);
      if (res.success) {
        setConvertedLeadIds((prev) => new Set(prev).add(leadId));
        // TODO: once clientsData is stateful, route back to the normal
        // Clients table with the new client included.
        console.log("Converted lead to client:", leadId);
      }
    } finally {
      setConvertingLeadId(null);
    }
  };

  return {
    isAddingClient,
    openLeadSearch,
    cancelLeadSearch,
    leadSearchQuery,
    setLeadSearchQuery,
    filteredLeads,
    convertingLeadId,
    convertedLeadIds,
    handleAddLead,
  };
};
