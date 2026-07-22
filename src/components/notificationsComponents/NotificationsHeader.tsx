// src/components/notificationsComponents/NotificationsHeader.tsx
import Image from "next/image";

interface NotificationsHeaderProps {
  heading: string;
  subheading: string;
  markAllAsReadLabel: string;
  onMarkAllAsRead: () => void;
  isMarking?: boolean;
}

const NotificationsHeader = ({
  heading,
  subheading,
  markAllAsReadLabel,
  onMarkAllAsRead,
  isMarking = false,
}: NotificationsHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1E293B]">{heading}</h1>
        <p className="text-sm text-[#64748B]">{subheading}</p>
      </div>

      <button
        type="button"
        onClick={onMarkAllAsRead}
        disabled={isMarking}
        className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <Image
          src="/notifications/markasread.svg"
          alt=""
          width={11}
          height={11}
        />
        {markAllAsReadLabel}
      </button>
    </div>
  );
};

export default NotificationsHeader;