// src/hooks/useNotifications.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  NotificationTab,
  filterNotificationsByTab,
} from "@/src/data/notificationsData/notificationsData";
import { notificationsService } from "@/src/services/notificationsService";
import { useNotificationsSummary } from "@/src/hooks/useNotificationsSummary";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { summary } = useNotificationsSummary();
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");

  // Fetch the full list once — switching tabs filters it client-side (see
  // filterNotificationsByTab) instead of firing a new request per tab, since
  // the backend's own filters (is_read / badge) are cheap to replicate here.
  const { data: allNotifications = [], isLoading } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => notificationsService.fetchNotifications("all"),
  });

  const notifications = useMemo(
    () => filterNotificationsByTab(allNotifications, activeTab),
    [allNotifications, activeTab]
  );

  // Invalidating the whole ["notifications"] prefix covers both the list
  // (any tab) and the summary — that's what makes the Header bell update
  // immediately from a mutation fired on the Notifications page, with no
  // manual refetch plumbing between them.
  const invalidateNotifications = () =>
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: invalidateNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: invalidateNotifications,
  });

  return {
    notifications,
    counts: {
      unread: summary.unread,
      followUpReminders: summary.follow_up_reminders,
      alerts: summary.alerts,
    },
    activeTab,
    setActiveTab,
    isLoading,
    isMarking: markAllAsReadMutation.isPending,
    // Errors already surfaced by the apiClient toast interceptor — swallow
    // here so a failed mark-as-read doesn't produce an unhandled rejection
    // for callers that fire this without awaiting (see NotificationsSection).
    handleMarkAllAsRead: () => markAllAsReadMutation.mutateAsync().catch(() => {}),
    handleMarkAsRead: (notificationId: string) =>
      markAsReadMutation.mutateAsync(notificationId).catch(() => {}),
  };
};
