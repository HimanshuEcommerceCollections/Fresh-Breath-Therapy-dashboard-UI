// src/data/notificationsData/notificationsData.ts
//
// Aligned to FBT_Notifications_API_Reference.docx sections 3.1/3.3. Badge
// values are lowercase, matching the backend's `badge` enum directly
// (reminder|overdue|scheduled|completed|message) — NotificationBadge already
// renders the label via a CSS `uppercase` class, so no casing conversion is
// needed anywhere else.

export type NotificationBadgeType =
  | "reminder"
  | "overdue"
  | "scheduled"
  | "completed"
  | "message";

export type NotificationCategory =
  | "follow_up_reminder"
  | "appointment_reminder"
  | "payment_due"
  | "missed_session"
  | "client_message";

export type RelatedEntityType = "session" | "follow_up" | "payment" | "client_message";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  badge: NotificationBadgeType;
  title: string;
  body: string;
  therapistId: string | null;
  relatedEntityType: RelatedEntityType | null;
  relatedEntityId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export const badgeStyles: Record<
  NotificationBadgeType,
  { bg: string; text: string; iconBg: string }
> = {
  reminder: { bg: "#FFEDD5", text: "#EA580C", iconBg: "#FFF7ED" },
  overdue: { bg: "#FEE2E2", text: "#DC2626", iconBg: "#FEF2F2" },
  scheduled: { bg: "#DBEAFE", text: "#2563EB", iconBg: "#EFF6FF" },
  completed: { bg: "#D1FAE5", text: "#059669", iconBg: "#ECFDF5" },
  message: { bg: "#F3E8FF", text: "#9333EA", iconBg: "#FAF5FF" },
};

// Section 6: "View X" should route using related_entity_type. There are no
// dedicated detail routes/pages for any entity in this frontend yet, so per
// product decision this navigates to the existing flat list page rather than
// deep-linking to the specific row. client_message has no route at all — the
// docs themselves note there's no message UI anywhere in the current design.
export const relatedEntityRoute: Record<RelatedEntityType, string | null> = {
  follow_up: "/follow-ups",
  session: "/sessions",
  payment: "/payments",
  client_message: null,
};

export const relatedEntityActionLabel: Record<RelatedEntityType, string> = {
  follow_up: "View Follow-Up",
  session: "View Session",
  payment: "View Payment",
  client_message: "View Message",
};

export const notificationsPageContent = {
  heading: "Notifications",
  subheading: "Stay updated on follow-ups, reminders, and client communication activity",
  markAllAsReadLabel: "Mark all as read",
  summaryCards: {
    unread: { label: "UNREAD", icon: "unread.svg", iconBg: "#FFF7ED" },
    followUpReminders: {
      label: "FOLLOW-UP REMINDERS",
      icon: "followupremainder.svg",
      iconBg: "#EFF6FF",
    },
    alerts: { label: "ALERTS", icon: "alerts.svg", iconBg: "#FEF2F2" },
  },
  tabs: ["All", "Unread", "Follow-Up Reminders", "Alerts", "Read"] as const,
  emptyState: {
    icon: "unread.svg",
    heading: "You're all caught up",
    subtext: "No notifications match this filter right now.",
  },
};

export type NotificationTab = (typeof notificationsPageContent.tabs)[number];

// Section 5.1's exact ?tab= contract.
export const tabToQueryParam: Record<NotificationTab, string> = {
  All: "all",
  Unread: "unread",
  "Follow-Up Reminders": "follow_up_reminders",
  Alerts: "alerts",
  Read: "read",
};
