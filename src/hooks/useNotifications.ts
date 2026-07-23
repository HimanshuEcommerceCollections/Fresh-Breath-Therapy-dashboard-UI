// src/hooks/useNotifications.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  NotificationItem,
  NotificationTab,
  tabToQueryParam,
} from "@/src/data/notificationsData/notificationsData";
import { notificationsService } from "@/src/services/notificationsService";
import { useNotificationsSummary } from "@/src/hooks/useNotificationsSummary";

export const useNotifications = () => {
  const { summary, refetchSummary } = useNotificationsSummary();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const loadNotifications = useCallback(async (tab: NotificationTab) => {
    setIsLoading(true);
    try {
      const data = await notificationsService.fetchNotifications(tabToQueryParam[tab]);
      setNotifications(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(activeTab);
  }, [activeTab, loadNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarking(true);
      await notificationsService.markAllAsRead();
      await Promise.all([loadNotifications(activeTab), refetchSummary()]);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsMarking(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      await Promise.all([loadNotifications(activeTab), refetchSummary()]);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    }
  };

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
    isMarking,
    handleMarkAllAsRead,
    handleMarkAsRead,
  };
};
