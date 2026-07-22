// src/components/notificationsComponents/NotificationBadge.tsx
import { NotificationBadgeType, badgeStyles } from "@/src/data/notificationsData/notificationsData";

interface NotificationBadgeProps {
  type: NotificationBadgeType;
  label: string;
}

const NotificationBadge = ({ type, label }: NotificationBadgeProps) => {
  const { bg, text } = badgeStyles[type];

  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-bold uppercase leading-[15px]"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
};

export default NotificationBadge;