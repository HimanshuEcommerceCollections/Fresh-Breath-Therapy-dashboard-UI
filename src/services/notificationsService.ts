// src/services/notificationsService.ts
//
// TODO: Wire real endpoints once API documentation is provided (GET
// /notifications, POST /notifications/mark-all-read, etc). Keeping this
// service layer stable now so the hook doesn't need to change later.

import { NotificationItem, notificationsMock } from "@/src/data/notificationsData/notificationsData";

export const notificationsService = {
  async fetchNotifications(): Promise<NotificationItem[]> {
    // TODO: replace with real GET /notifications call
    return new Promise((resolve) =>
      setTimeout(() => resolve(notificationsMock), 400)
    );
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    // TODO: replace with real POST /notifications/mark-all-read call
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500)
    );
  },
};