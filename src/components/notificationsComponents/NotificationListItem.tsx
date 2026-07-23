// src/components/notificationsComponents/NotificationListItem.tsx
import { Bell, AlertCircle, Calendar, CheckCircle2, MessageCircle } from "lucide-react";
import {
  NotificationItem,
  badgeStyles,
  relatedEntityActionLabel,
  relatedEntityRoute,
} from "@/src/data/notificationsData/notificationsData";
import { formatDateLabel, formatRelativeTime } from "@/src/lib/formatRelativeTime";
import NotificationBadge from "./NotificationBadge";

interface NotificationListItemProps {
  notification: NotificationItem;
  onAction?: (notification: NotificationItem) => void;
  isLast?: boolean;
}

// Section 6: "reminder=orange bell, overdue=red alert circle,
// scheduled=blue calendar, completed=green check, message=purple message
// bubble" — colors come straight from the existing badgeStyles config.
const BADGE_ICON = {
  reminder: Bell,
  overdue: AlertCircle,
  scheduled: Calendar,
  completed: CheckCircle2,
  message: MessageCircle,
} as const;

const NotificationListItem = ({
  notification,
  onAction,
  isLast = false,
}: NotificationListItemProps) => {
  const { title, badge, body, relatedEntityType, isRead, createdAt } = notification;
  const { iconBg, text } = badgeStyles[badge];
  const Icon = BADGE_ICON[badge];

  const actionLabel = relatedEntityType
    ? relatedEntityActionLabel[relatedEntityType]
    : null;
  const hasRoute = relatedEntityType ? relatedEntityRoute[relatedEntityType] !== null : false;

  return (
    <div
      className={`flex w-full items-start gap-4 px-5 py-5 ${
        isRead ? "" : "bg-[#F8FAFC]"
      } ${isLast ? "" : "border-b border-[#E2E8F0]"}`}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="h-4 w-4" style={{ color: text }} strokeWidth={2} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          {!isRead && (
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
          )}
          <h4 className="text-sm font-bold text-[#1E293B]">{title}</h4>
          <NotificationBadge type={badge} label={badge} />
        </div>

        <p className="text-sm text-[#64748B]">{body}</p>

        <div className="flex items-center gap-4 pt-1">
          <span className="text-xs text-[#9CA3AF]">{formatDateLabel(createdAt)}</span>
          <span className="text-xs text-[#9CA3AF]">{formatRelativeTime(createdAt)}</span>
        </div>
      </div>

      {actionLabel && (
        <button
          type="button"
          disabled={!hasRoute}
          onClick={() => onAction?.(notification)}
          title={hasRoute ? undefined : "No detail view exists for this item yet"}
          className="shrink-0 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-bold text-[#1E293B] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NotificationListItem;
