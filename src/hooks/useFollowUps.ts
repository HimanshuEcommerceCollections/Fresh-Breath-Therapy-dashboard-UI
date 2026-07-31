// src/hooks/useFollowUps.ts
"use client";

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
  const statusFilter = activeTab === "All" ? undefined : (activeTab as FollowUpStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["follow-ups", statusFilter],
    queryFn: async () => {
      const [rawFollowUps, clients, freshStats] = await Promise.all([
        followUpsService.fetchFollowUps(statusFilter),
        clientsService.fetchClients(),
        followUpsService.fetchStats(),
      ]);
      const clientNameById = new Map(clients.map((c) => [c.id, c.name]));
      return {
        followUps: rawFollowUps.map((f) => ({
          ...f,
          client: clientNameById.get(f.clientId) ?? "Unknown client",
        })),
        stats: freshStats,
      };
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["follow-ups"] });

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
    followUps: data?.followUps ?? [],
    stats: data?.stats ?? EMPTY_STATS,
    isLoading,
    createFollowUp,
    completeFollowUp,
  };
};
