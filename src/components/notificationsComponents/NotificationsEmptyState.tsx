// src/components/notificationsComponents/NotificationsEmptyState.tsx
import Image from "next/image";

interface NotificationsEmptyStateProps {
  icon: string;
  heading: string;
  subtext: string;
}

const NotificationsEmptyState = ({
  icon,
  heading,
  subtext,
}: NotificationsEmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F5F9] opacity-70">
        <Image src={`/notifications/${icon}`} alt="" width={24} height={24} />
      </div>
      <p className="text-lg font-bold text-[#1E293B]">{heading}</p>
      <p className="text-sm text-[#94A3B8]">{subtext}</p>
    </div>
  );
};

export default NotificationsEmptyState;