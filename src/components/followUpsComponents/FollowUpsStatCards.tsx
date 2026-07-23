import type { FollowUpStats } from "@/src/services/followUpsService";
import StatCard from "@/src/sections/followUpsSections/StatCard";

export default function FollowUpsStatCards({ stats }: { stats: FollowUpStats }) {
  return (
    <div className="flex flex-row gap-4">
      <StatCard
        label="Pending"
        value={stats.pending}
        iconSrc="/dashboard/dashboardicons/leadsicons/pendingfollowups.svg"
        iconBg="rgba(242,166,24,0.1)"
        iconColor="#F2A618"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        iconSrc="/dashboard/dashboardicons/followupicons/overdue.svg"
        iconBg="rgba(242,42,54,0.1)"
        iconColor="#F22A36"
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        iconSrc="/dashboard/dashboardicons/sessionicons/completed.svg"
        iconBg="rgba(63,193,104,0.1)"
        iconColor="#3FC168"
      />
    </div>
  );
}
