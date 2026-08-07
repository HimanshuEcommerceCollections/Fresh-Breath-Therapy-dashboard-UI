// src/hooks/useFollowUps.ts
"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUpsService,
  type FollowUpStats,
  type CreateFollowUpPayload,
} from "@/src/services/followUpsService";
import { clientsService } from "@/src/services/clientsService";
import { showSuccessToast } from "@/src/lib/toast";
import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";
import type { FollowUpFilter } from "@/src/sections/followUpsSections/FilterTabs";

const EMPTY_STATS: FollowUpStats = { pending: 0, overdue: 0, completed: 0 };

export const useFollowUps = (activeTab: FollowUpFilter) => {
  const queryClient = useQueryClient();

  // Client name-lookup needs the full roster — a partial page of clients
  // would leave later follow-ups joined as "Unknown client".
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients", "all", {}],
    queryFn: () => clientsService.fetchAllClients(),
  });
  const clientNameById = useMemo(
    () => new Map(allClients.map((c) => [c.id, c.name])),
    [allClients]
  );

  // The complete follow-up list, fetched once. The tabs below filter this
  // in memory — switching tabs is instant and fires no request, since the
  // list is already whole (this is what "the list must be complete before
  // you filter it" requires: without this, filtering a partial page would
  // just hide rows that never loaded rather than actually filtering).
  const { data: allFollowUps = [], isLoading: isLoadingFollowUps } = useQuery({
    queryKey: ["follow-ups", "all"],
    queryFn: () => followUpsService.fetchAllFollowUps(),
  });

  const followUpsWithClient = useMemo(
    () =>
      allFollowUps.map((f) => ({
        ...f,
        client: clientNameById.get(f.clientId) ?? "Unknown client",
      })),
    [allFollowUps, clientNameById]
  );

  const followUps = useMemo(() => {
    if (activeTab === "All") return followUpsWithClient;
    return followUpsWithClient.filter((f) => f.status === (activeTab as FollowUpStatus));
  }, [followUpsWithClient, activeTab]);

  const { data: stats = EMPTY_STATS, isLoading: isLoadingStats } = useQuery({
    queryKey: ["follow-ups", "stats"],
    queryFn: () => followUpsService.fetchStats(),
  });

  const isLoading = isLoadingFollowUps || isLoadingStats;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
  };

  const createFollowUpMutation = useMutation({
    mutationFn: (payload: CreateFollowUpPayload) => followUpsService.createFollowUp(payload),
    onSuccess: () => {
      showSuccessToast("Follow-up created");
      invalidate();
    },
  });

  const completeFollowUpMutation = useMutation({
    mutationFn: (followUpId: string) => followUpsService.completeFollowUp(followUpId),
    onSuccess: () => {
      showSuccessToast("Follow-up marked complete");
      invalidate();
    },
  });

  const createFollowUp = async (payload: CreateFollowUpPayload) => {
    await createFollowUpMutation.mutateAsync(payload);
  };

  const completeFollowUp = async (followUpId: string) => {
    await completeFollowUpMutation.mutateAsync(followUpId);
  };

  return {
    followUps,
    stats,
    isLoading,
    createFollowUp,
    completeFollowUp,
  };
};
