// src/hooks/useClients.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { clientsService, type Client } from "@/src/services/clientsService";
import { leadsService, type Lead } from "@/src/services/leadsService";
import { showSuccessToast } from "@/src/lib/toast";

const SEARCH_DEBOUNCE_MS = 350;

export const useClients = () => {
  // Real Clients table state.
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clientsService.fetchClients({
        search: search || undefined,
        locationId: locationId ?? undefined,
      });
      setClients(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, [search, locationId]);

  useEffect(() => {
    const timeout = setTimeout(fetchClients, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [fetchClients]);

  const createClient = async (payload: Parameters<typeof clientsService.createClient>[0]) => {
    const client = await clientsService.createClient(payload);
    showSuccessToast("Client created");
    setClients((prev) => [client, ...prev]);
    return client;
  };

  // Lead-search "Add Client" flow — real leads, real convert endpoint
  // (POST /api/leads/{lead_id}/convert, section 7).
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const [convertedLeadIds, setConvertedLeadIds] = useState<Set<string>>(new Set());

  const fetchLeadsForSearch = useCallback(async (query: string) => {
    try {
      const data = await leadsService.fetchLeads({ search: query || undefined });
      setLeads(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    }
  }, []);

  useEffect(() => {
    if (!isAddingClient) return;
    const timeout = setTimeout(() => fetchLeadsForSearch(leadSearchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [isAddingClient, leadSearchQuery, fetchLeadsForSearch]);

  const openLeadSearch = () => {
    setIsAddingClient(true);
    fetchLeadsForSearch(leadSearchQuery);
  };
  const cancelLeadSearch = () => {
    setIsAddingClient(false);
    setLeadSearchQuery("");
  };

  const handleAddLead = async (leadId: string) => {
    setConvertingLeadId(leadId);
    try {
      const client = await clientsService.convertLeadToClient(leadId);
      setConvertedLeadIds((prev) => new Set(prev).add(leadId));
      showSuccessToast("Lead converted to client");
      setClients((prev) => [client, ...prev]);
      // Land back on the normal Clients table showing the new client — there
      // is no per-client detail route in this app to navigate to instead.
      cancelLeadSearch();
    } finally {
      setConvertingLeadId(null);
    }
  };

  return {
    clients,
    isLoading,
    search,
    setSearch,
    locationId,
    setLocationId,
    createClient,
    isAddingClient,
    openLeadSearch,
    cancelLeadSearch,
    leadSearchQuery,
    setLeadSearchQuery,
    filteredLeads: leads,
    convertingLeadId,
    convertedLeadIds,
    handleAddLead,
  };
};
