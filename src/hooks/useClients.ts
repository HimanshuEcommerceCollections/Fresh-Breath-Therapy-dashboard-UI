// src/hooks/useClients.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { leadsData, type Lead } from "@/src/data/leadsData/leadsData";
import { clientsService, type Client } from "@/src/services/clientsService";
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

  // Lead-search "Add Client" flow — unchanged mock behavior, see the
  // MISMATCH note in clientsService.ts (no real convert-lead-to-client
  // endpoint exists).
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
        // TODO: once a real convert-lead-to-client endpoint exists, refetch
        // the real clients list here instead of just marking it locally.
        console.log("Converted lead to client:", leadId);
      }
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
    filteredLeads,
    convertingLeadId,
    convertedLeadIds,
    handleAddLead,
  };
};
