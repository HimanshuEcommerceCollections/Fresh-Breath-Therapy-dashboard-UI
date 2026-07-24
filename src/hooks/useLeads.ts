// src/hooks/useLeads.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { leadsService, type Lead, type LeadFilters, type CreateLeadPayload } from "@/src/services/leadsService";
import { showSuccessToast } from "@/src/lib/toast";
import type { LeadStatus } from "@/src/data/leadsData/leadsData";

const SEARCH_DEBOUNCE_MS = 350;

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (filters?: LeadFilters) => {
    setIsLoading(true);
    try {
      const data = await leadsService.fetchLeads(filters);
      setLeads(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLeads({
        search: search || undefined,
        statusFilter: statusFilter ?? undefined,
        locationId: locationId ?? undefined,
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, locationId]);

  const createLead = async (payload: CreateLeadPayload) => {
    const lead = await leadsService.createLead(payload);
    showSuccessToast("Lead created");
    setLeads((prev) => [lead, ...prev]);
    return lead;
  };

  return {
    leads,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    locationId,
    setLocationId,
    createLead,
  };
};
