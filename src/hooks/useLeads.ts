// src/hooks/useLeads.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService, type CreateLeadPayload, type LeadFilters } from "@/src/services/leadsService";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { showSuccessToast } from "@/src/lib/toast";
import type { LeadStatus } from "@/src/data/leadsData/leadsData";

const SEARCH_DEBOUNCE_MS = 350;

export const useLeads = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const filters: LeadFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      statusFilter: statusFilter ?? undefined,
      locationId: locationId ?? undefined,
    }),
    [debouncedSearch, statusFilter, locationId]
  );

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads", filters],
    queryFn: () => leadsService.fetchLeads(filters),
  });

  const createLeadMutation = useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsService.createLead(payload),
    onSuccess: () => {
      showSuccessToast("Lead created");
      // A new lead also changes Dashboard's total-leads stat card.
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, payload }: { leadId: string; payload: Partial<CreateLeadPayload> }) =>
      leadsService.updateLead(leadId, payload),
    onSuccess: () => {
      showSuccessToast("Lead updated");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (leadId: string) => leadsService.deleteLead(leadId),
    onSuccess: () => {
      showSuccessToast("Lead deleted");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    leads,
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    locationId,
    setLocationId,
    createLead: createLeadMutation.mutateAsync,
    updateLead: (leadId: string, payload: Partial<CreateLeadPayload>) =>
      updateLeadMutation.mutateAsync({ leadId, payload }),
    deleteLead: deleteLeadMutation.mutateAsync,
  };
};
