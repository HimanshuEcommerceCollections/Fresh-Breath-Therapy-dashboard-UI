// src/services/notificationsService.ts
//
// Wired to the real backend per FBT_Notifications_API_Reference.docx
// sections 5. GET endpoints here are read-only (Idempotency-Key not
// supported per the docs), so no idempotent flag is set on any call.

import { apiClient } from "@/src/lib/apiClient";
import { NotificationItem } from "@/src/data/notificationsData/notificationsData";

export interface NotificationsSummary {
  unread: number;
  follow_up_reminders: number;
  alerts: number;
}

interface ApiNotification {
  id: string;
  category: NotificationItem["category"];
  badge: NotificationItem["badge"];
  title: string;
  body: string;
  therapist_id: string | null;
  related_entity_type: NotificationItem["relatedEntityType"];
  related_entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

function toNotificationItem(raw: ApiNotification): NotificationItem {
  return {
    id: raw.id,
    category: raw.category,
    badge: raw.badge,
    title: raw.title,
    body: raw.body,
    therapistId: raw.therapist_id,
    relatedEntityType: raw.related_entity_type,
    relatedEntityId: raw.related_entity_id,
    isRead: raw.is_read,
    readAt: raw.read_at,
    createdAt: raw.created_at,
  };
}

export const notificationsService = {
  async fetchNotifications(tabQueryParam: string): Promise<NotificationItem[]> {
    const res = await apiClient.get<ApiNotification[]>("/api/notifications", {
      params: { tab: tabQueryParam },
    });
    return res.data.map(toNotificationItem);
  },

  async fetchSummary(): Promise<NotificationsSummary> {
    const res = await apiClient.get<NotificationsSummary>("/api/notifications/summary");
    return res.data;
  },

  async markAsRead(notificationId: string): Promise<NotificationItem> {
    const res = await apiClient.patch<ApiNotification>(
      `/api/notifications/${notificationId}/read`
    );
    return toNotificationItem(res.data);
  },

  async markAllAsRead(): Promise<{ success: boolean; markedRead: number }> {
    const res = await apiClient.post<{ marked_read: number }>(
      "/api/notifications/mark-all-read"
    );
    return { success: true, markedRead: res.data.marked_read };
  },
};
