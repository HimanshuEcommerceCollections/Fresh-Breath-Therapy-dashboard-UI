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
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { showSuccessToast } from "@/src/lib/toast";
import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";
import type { FollowUpFilter } from "@/src/sections/followUpsSections/FilterTabs";

const EMPTY_STATS: FollowUpStats = { pending: 0, overdue: 0, completed: 0 };

export const useFollowUps = (activeTab: FollowUpFilter) => {
  const queryClient = useQueryClient();
  const statusFilter = activeTab === "All" ? undefined : (activeTab as FollowUpStatus);

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

  const {
    items: rawFollowUps,
    isLoading: isLoadingFollowUps,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList({
    queryKey: ["follow-ups", statusFilter],
    queryFn: (cursor) => followUpsService.fetchFollowUps(statusFilter, cursor),
  });
  const followUps = useMemo(
    () =>
      rawFollowUps.map((f) => ({
        ...f,
        client: clientNameById.get(f.clientId) ?? "Unknown client",
      })),
    [rawFollowUps, clientNameById]
  );

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
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    createFollowUp,
    completeFollowUp,
  };
};
