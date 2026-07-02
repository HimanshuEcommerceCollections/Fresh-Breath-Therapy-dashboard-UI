import { followUpsData } from "@/src/data/followUpsData/followUpsData";
import StatCard from "@/src/sections/followUpsSections/StatCard";

export default function FollowUpsStatCards() {
  const count = (status: string) =>
    followUpsData.filter((f) => f.status === status).length;

  return (
    <div className="flex flex-row gap-4">
      <StatCard
        label="Pending"
        value={count("Pending")}
        iconSrc="/dashboard/dashboardicons/leadsicons/pendingfollowups.svg"
        iconBg="rgba(242,166,24,0.1)"
        iconColor="#F2A618"
      />
      <StatCard
        label="Overdue"
        value={count("Overdue")}
        iconSrc="/dashboard/dashboardicons/followupicons/overdue.svg"
        iconBg="rgba(242,42,54,0.1)"
        iconColor="#F22A36"
      />
      <StatCard
        label="Completed"
        value={count("Completed")}
        iconSrc="/dashboard/dashboardicons/sessionicons/completed.svg"
        iconBg="rgba(63,193,104,0.1)"
        iconColor="#3FC168"
      />
    </div>
  );
}
