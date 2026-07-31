// src/hooks/useNotificationsSummary.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  notificationsService,
  type NotificationsSummary,
} from "@/src/services/notificationsService";

const POLL_INTERVAL_MS = 45000; // within the documented 30-60s recommendation

const EMPTY_SUMMARY: NotificationsSummary = {
  unread: 0,
  follow_up_reminders: 0,
  alerts: 0,
};

// No Context/Provider needed — React Query's cache is itself the shared
// store, so every component calling this hook with the same query key
// (["notifications", "summary"]) reads/updates the same cached value. That's
// also what makes mutation-invalidation (see useNotifications.ts) update
// the Sidebar/Header bell instantly, with no manual refetch plumbing.
export function useNotificationsSummary() {
  const { data: summary = EMPTY_SUMMARY, refetch } = useQuery({
    queryKey: ["notifications", "summary"],
    queryFn: () => notificationsService.fetchSummary(),
    refetchInterval: POLL_INTERVAL_MS,
  });

  return { summary, refetchSummary: refetch };
}
