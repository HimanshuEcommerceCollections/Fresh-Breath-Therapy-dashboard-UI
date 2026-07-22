// src/hooks/useNotifications.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  NotificationItem,
  NotificationTab,
  notificationsMock,
} from "@/src/data/notificationsData/notificationsData";
import { notificationsService } from "@/src/services/notificationsService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationsMock
  );
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await notificationsService.fetchNotifications();
        if (isMounted) setNotifications(data);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const followUpReminders = notifications.filter(
      (n) => n.badgeType === "REMINDER" || n.badgeType === "SCHEDULED"
    ).length;
    const alerts = notifications.filter((n) => n.badgeType === "OVERDUE").length;
    return { unread, followUpReminders, alerts };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "Unread":
        return notifications.filter((n) => !n.isRead);
      case "Follow-Up Reminders":
        return notifications.filter(
          (n) => n.badgeType === "REMINDER" || n.badgeType === "SCHEDULED"
        );
      case "Alerts":
        return notifications.filter((n) => n.badgeType === "OVERDUE");
      case "Read":
        return notifications.filter((n) => n.isRead);
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarking(true);
      const res = await notificationsService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } finally {
      setIsMarking(false);
    }
  };

  return {
    notifications: filteredNotifications,
    counts,
    activeTab,
    setActiveTab,
    isLoading,
    isMarking,
    handleMarkAllAsRead,
  };
};