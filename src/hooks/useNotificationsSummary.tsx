// src/hooks/useNotificationsSummary.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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

interface NotificationsSummaryContextValue {
  summary: NotificationsSummary;
  refetchSummary: () => Promise<void>;
}

const NotificationsSummaryContext =
  createContext<NotificationsSummaryContextValue | null>(null);

export function NotificationsSummaryProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<NotificationsSummary>(EMPTY_SUMMARY);

  const refetchSummary = useCallback(async () => {
    try {
      const data = await notificationsService.fetchSummary();
      setSummary(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    }
  }, []);

  useEffect(() => {
    refetchSummary();
    const interval = setInterval(refetchSummary, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refetchSummary]);

  return (
    <NotificationsSummaryContext.Provider value={{ summary, refetchSummary }}>
      {children}
    </NotificationsSummaryContext.Provider>
  );
}

export function useNotificationsSummary() {
  const ctx = useContext(NotificationsSummaryContext);
  if (!ctx) {
    throw new Error(
      "useNotificationsSummary must be used within a NotificationsSummaryProvider"
    );
  }
  return ctx;
}
