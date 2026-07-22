// src/components/notificationsComponents/NotificationListItem.tsx
import Image from "next/image";
import { User, Calendar, Clock } from "lucide-react";
import {
  NotificationItem,
  badgeStyles,
} from "@/src/data/notificationsData/notificationsData";
import NotificationBadge from "./NotificationBadge";

interface NotificationListItemProps {
  notification: NotificationItem;
  onAction?: (notification: NotificationItem) => void;
  isLast?: boolean;
}

const NotificationListItem = ({
  notification,
  onAction,
  isLast = false,
}: NotificationListItemProps) => {
  const { icon, title, badgeType, badgeLabel, description, clientName, dateLabel, timeAgo, actionLabel } =
    notification;
  const iconBg = badgeStyles[badgeType].iconBg;

  return (
    <div
      className={`flex w-full items-start gap-4 px-5 py-5 ${
        isLast ? "" : "border-b border-[#E2E8F0]"
      }`}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Image src={`/notifications/${icon}`} alt="" width={16} height={16} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-[#1E293B]">{title}</h4>
          <NotificationBadge type={badgeType} label={badgeLabel} />
        </div>

        <p className="text-sm text-[#64748B]">{description}</p>

        <div className="flex items-center gap-4 pt-1">
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <User className="h-2.5 w-2.5" strokeWidth={2} />
            {clientName}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Calendar className="h-2.5 w-2.5" strokeWidth={2} />
            {dateLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="h-2.5 w-2.5" strokeWidth={2} />
            {timeAgo}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAction?.(notification)}
        className="shrink-0 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-bold text-[#1E293B] transition-colors hover:bg-[#F8FAFC]"
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default NotificationListItem;