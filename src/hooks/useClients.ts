// src/hooks/useClients.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/src/services/clientsService";
import { leadsService } from "@/src/services/leadsService";
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { showSuccessToast } from "@/src/lib/toast";

const SEARCH_DEBOUNCE_MS = 350;

export const useClients = () => {
  const queryClient = useQueryClient();

  // Real Clients table state.
  const [search, setSearch] = useState("");
  const [locationId, setLocationId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const clientFilters = useMemo(
    () => ({ search: debouncedSearch || undefined, locationId: locationId ?? undefined }),
    [debouncedSearch, locationId]
  );

  const {
    items: clients,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList({
    queryKey: ["clients", clientFilters],
    queryFn: (cursor) => clientsService.fetchClients(clientFilters, cursor),
  });

  // The page header's total count needs every matching client, not just
  // whatever page has scrolled into view.
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients", "all", clientFilters],
    queryFn: () => clientsService.fetchAllClients(clientFilters),
  });

  const createClientMutation = useMutation({
    mutationFn: (payload: Parameters<typeof clientsService.createClient>[0]) =>
      clientsService.createClient(payload),
    onSuccess: () => {
      showSuccessToast("Client created");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({
      clientId,
      payload,
    }: {
      clientId: string;
      payload: Partial<Parameters<typeof clientsService.createClient>[0]>;
    }) => clientsService.updateClient(clientId, payload),
    onSuccess: () => {
      showSuccessToast("Client updated");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (clientId: string) => clientsService.deleteClient(clientId),
    onSuccess: () => {
      showSuccessToast("Client deleted");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  // Lead-search "Add Client" flow — real leads, real convert endpoint
  // (POST /api/leads/{lead_id}/convert, section 7).
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const [convertedLeadIds, setConvertedLeadIds] = useState<Set<string>>(new Set());

  const debouncedLeadSearch = useDebouncedValue(leadSearchQuery, SEARCH_DEBOUNCE_MS);

  const { data: filteredLeadsPage, isFetching: isSearchingLeads } = useQuery({
    queryKey: ["leads", { search: debouncedLeadSearch || undefined }],
    queryFn: () => leadsService.fetchLeads({ search: debouncedLeadSearch || undefined }),
    // Only search leads while the "Add Client" panel is actually open.
    enabled: isAddingClient,
  });
  const filteredLeads = filteredLeadsPage?.items ?? [];
  // True from the first keystroke until fresh results land — covers both the
  // debounce window and the request itself, so "No leads match your search"
  // never appears over a list that is about to change.
  const isLeadSearchPending =
    isSearchingLeads || leadSearchQuery !== debouncedLeadSearch;

  const openLeadSearch = () => setIsAddingClient(true);
  const cancelLeadSearch = () => {
    setIsAddingClient(false);
    setLeadSearchQuery("");
  };

  const convertLeadMutation = useMutation({
    mutationFn: (leadId: string) => clientsService.convertLeadToClient(leadId),
    onMutate: (leadId) => setConvertingLeadId(leadId),
    onSuccess: (_client, leadId) => {
      setConvertedLeadIds((prev) => new Set(prev).add(leadId));
      showSuccessToast("Lead converted to client");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Land back on the normal Clients table showing the new client — there
      // is no per-client detail route in this app to navigate to instead.
      cancelLeadSearch();
    },
    onSettled: () => setConvertingLeadId(null),
  });

  const handleAddLead = (leadId: string) => convertLeadMutation.mutateAsync(leadId);

  return {
    clients,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    allClients,
    search,
    setSearch,
    locationId,
    setLocationId,
    createClient: createClientMutation.mutateAsync,
    updateClient: (clientId: string, payload: Partial<Parameters<typeof clientsService.createClient>[0]>) =>
      updateClientMutation.mutateAsync({ clientId, payload }),
    deleteClient: deleteClientMutation.mutateAsync,
    isAddingClient,
    openLeadSearch,
    cancelLeadSearch,
    leadSearchQuery,
    setLeadSearchQuery,
    filteredLeads,
    isLeadSearchPending,
    convertingLeadId,
    convertedLeadIds,
    handleAddLead,
  };
};
