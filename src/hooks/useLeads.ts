// src/hooks/useLeads.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsService, type CreateLeadPayload, type LeadFilters } from "@/src/services/leadsService";
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { showSuccessToast } from "@/src/lib/toast";
import type { LeadStatus } from "@/src/data/leadsData/leadsData";
import type { LeadsView } from "@/src/sections/leadsSections/ViewToggleTabs";

const SEARCH_DEBOUNCE_MS = 350;

export const useLeads = (activeView: LeadsView = "table") => {
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

  const {
    items: leads,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList({
    queryKey: ["leads", filters],
    queryFn: (cursor) => leadsService.fetchLeads(filters, cursor),
    enabled: activeView === "table",
  });

  // The pipeline (kanban) board groups the FULL filtered set by status
  // across columns, and the page header's totals need the true count — both
  // would be wrong reading off just whatever page has scrolled into view.
  const { data: allLeads = [], isLoading: isLoadingAllLeads } = useQuery({
    queryKey: ["leads", "all", filters],
    queryFn: () => leadsService.fetchAllLeads(filters),
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
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    allLeads,
    isLoadingAllLeads,
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
