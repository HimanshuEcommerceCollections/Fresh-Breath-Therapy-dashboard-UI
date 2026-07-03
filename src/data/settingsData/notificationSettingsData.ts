// TODO: replace with backend-fetched settings (/api/settings/notifications).
export type NotificationSetting = { id: string; label: string; enabled: boolean };

export const notificationSettingsData: NotificationSetting[] = [
  { id: "1", label: "Follow-Up Reminders", enabled: true },
  { id: "2", label: "Appointment Reminders", enabled: true },
  { id: "3", label: "Payment Due Alerts", enabled: true },
  { id: "4", label: "Missed Session Alerts", enabled: true },
];
