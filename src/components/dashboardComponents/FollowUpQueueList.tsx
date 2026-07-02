import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import FollowUpQueueItem from "@/src/sections/dashboardSections/FollowUpQueueItem";
import CardHeaderLink from "@/src/sections/dashboardSections/CardHeaderLink";
import { followUpQueueData } from "@/src/data/dashboardData/followUpQueueData";

export default function FollowUpQueueList() {
  return (
    <ChartCard
      title="Follow-Up Queue"
      action={<CardHeaderLink label="Manage" />}
    >
      <div className="flex flex-col gap-2">
        {followUpQueueData.map((item) => (
          <FollowUpQueueItem key={item.id} item={item} />
        ))}
      </div>
    </ChartCard>
  );
}
