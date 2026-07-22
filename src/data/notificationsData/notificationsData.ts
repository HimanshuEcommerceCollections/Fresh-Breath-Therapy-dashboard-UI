// src/data/notificationsData/notificationsData.ts

export type NotificationBadgeType =
  | "REMINDER"
  | "OVERDUE"
  | "SCHEDULED"
  | "COMPLETED"
  | "MESSAGE";

export interface NotificationItem {
  id: string;
  icon: string; // filename inside /public/notifications
  title: string;
  badgeType: NotificationBadgeType;
  badgeLabel: string;
  description: string;
  clientName: string;
  dateLabel: string;
  timeAgo: string;
  actionLabel: string;
  isRead: boolean;
}

export const badgeStyles: Record<
  NotificationBadgeType,
  { bg: string; text: string; iconBg: string }
> = {
  REMINDER: { bg: "#FFEDD5", text: "#EA580C", iconBg: "#FFF7ED" },
  OVERDUE: { bg: "#FEE2E2", text: "#DC2626", iconBg: "#FEF2F2" },
  SCHEDULED: { bg: "#DBEAFE", text: "#2563EB", iconBg: "#EFF6FF" },
  COMPLETED: { bg: "#D1FAE5", text: "#059669", iconBg: "#ECFDF5" },
  MESSAGE: { bg: "#F3E8FF", text: "#9333EA", iconBg: "#FAF5FF" },
};

export const notificationsMock: NotificationItem[] = [
  {
    id: "notif-1",
    icon: "star.svg",
    title: "Follow-up due today",
    badgeType: "REMINDER",
    badgeLabel: "REMINDER",
    description: "Follow-up reminder for Emily Garcia is due today.",
    clientName: "Emily Garcia",
    dateLabel: "Due 2026-06-21",
    timeAgo: "10 min ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-2",
    icon: "overdue.svg",
    title: "Follow-up overdue",
    badgeType: "OVERDUE",
    badgeLabel: "OVERDUE",
    description: "Caden Harris has an overdue follow-up from yesterday.",
    clientName: "Caden Harris",
    dateLabel: "Overdue - 2026-06-22",
    timeAgo: "1 hour ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-3",
    icon: "reminderscheduled.svg",
    title: "Reminder scheduled",
    badgeType: "SCHEDULED",
    badgeLabel: "SCHEDULED",
    description: "Reminder set for Lucas Taylor's next session.",
    clientName: "Lucas Taylor",
    dateLabel: "Scheduled 2026-06-23",
    timeAgo: "2 hours ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-4",
    icon: "completetick.svg",
    title: "Follow-up completed",
    badgeType: "COMPLETED",
    badgeLabel: "COMPLETED",
    description: "Follow-up with Liam Quinn was marked as completed.",
    clientName: "Liam Quinn",
    dateLabel: "Completed 2026-06-24",
    timeAgo: "3 hours ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-5",
    icon: "halfclock.svg",
    title: "Follow-up due tomorrow",
    badgeType: "REMINDER",
    badgeLabel: "REMINDER",
    description: "Call to confirm next session with William Parker.",
    clientName: "William Parker",
    dateLabel: "Due 2026-06-25",
    timeAgo: "5 hours ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-6",
    icon: "overdue.svg",
    title: "Follow-up overdue",
    badgeType: "OVERDUE",
    badgeLabel: "OVERDUE",
    description: "Scarlett Carter's insurance follow-up is overdue.",
    clientName: "Scarlett Carter",
    dateLabel: "Overdue - 2026-06-22",
    timeAgo: "Yesterday",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-7",
    icon: "message.svg",
    title: "New client message",
    badgeType: "MESSAGE",
    badgeLabel: "MESSAGE",
    description: "Mia Foster replied about therapy progress check-in.",
    clientName: "Mia Foster",
    dateLabel: "Session 2026-06-30",
    timeAgo: "Yesterday",
    actionLabel: "View Message",
    isRead: true,
  },
  {
    id: "notif-8",
    icon: "completetick.svg",
    title: "Follow-up completed",
    badgeType: "COMPLETED",
    badgeLabel: "COMPLETED",
    description: "Insurance follow-up with Evelyn Parker closed successfully.",
    clientName: "Evelyn Parker",
    dateLabel: "Completed 2026-06-23",
    timeAgo: "2 days ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
  {
    id: "notif-9",
    icon: "package_renewal.svg",
    title: "Package renewal reminder",
    badgeType: "REMINDER",
    badgeLabel: "REMINDER",
    description: "Discuss package renewal with Elizabeth Garcia.",
    clientName: "Elizabeth Garcia",
    dateLabel: "Due 2026-06-27",
    timeAgo: "2 days ago",
    actionLabel: "View Follow-Up",
    isRead: true,
  },
];

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