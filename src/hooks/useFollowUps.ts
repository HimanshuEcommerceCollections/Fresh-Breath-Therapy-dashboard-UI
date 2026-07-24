// src/hooks/useFollowUps.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  followUpsService,
  type FollowUpWithClient,
  type FollowUpStats,
  type CreateFollowUpPayload,
} from "@/src/services/followUpsService";
import { clientsService } from "@/src/services/clientsService";
import { showSuccessToast } from "@/src/lib/toast";
import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";
import type { FollowUpFilter } from "@/src/sections/followUpsSections/FilterTabs";

const EMPTY_STATS: FollowUpStats = { pending: 0, overdue: 0, completed: 0 };

export const useFollowUps = (activeTab: FollowUpFilter) => {
  const [followUps, setFollowUps] = useState<FollowUpWithClient[]>([]);
  const [stats, setStats] = useState<FollowUpStats>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusFilter = activeTab === "All" ? undefined : (activeTab as FollowUpStatus);
      const [rawFollowUps, clients, freshStats] = await Promise.all([
        followUpsService.fetchFollowUps(statusFilter),
        clientsService.fetchClients(),
        followUpsService.fetchStats(),
      ]);
      const clientNameById = new Map(clients.map((c) => [c.id, c.name]));
      setFollowUps(
        rawFollowUps.map((f) => ({
          ...f,
          client: clientNameById.get(f.clientId) ?? "Unknown client",
        }))
      );
      setStats(freshStats);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const createFollowUp = async (payload: CreateFollowUpPayload) => {
    await followUpsService.createFollowUp(payload);
    showSuccessToast("Follow-up created");
    await load();
  };

  const completeFollowUp = async (followUpId: string) => {
    await followUpsService.completeFollowUp(followUpId);
    showSuccessToast("Follow-up marked complete");
    await load();
  };

  return { followUps, stats, isLoading, createFollowUp, completeFollowUp };
};
