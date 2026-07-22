// src/components/notificationsComponents/NotificationSummaryCard.tsx
import Image from "next/image";

interface NotificationSummaryCardProps {
  label: string;
  count: number;
  icon: string; // filename inside /public/notifications
  iconBg: string;
}

const NotificationSummaryCard = ({
  label,
  count,
  icon,
  iconBg,
}: NotificationSummaryCardProps) => {
  return (
    <div className="flex flex-1 items-center justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#64748B]">
          {label}
        </span>
        <span className="text-3xl font-bold leading-9 text-[#1E293B]">
          {count}
        </span>
      </div>

      <div
        className="flex h-[45px] w-[45px] items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Image src={`/notifications/${icon}`} alt="" width={20} height={20} />
      </div>
    </div>
  );
};

export default NotificationSummaryCard;