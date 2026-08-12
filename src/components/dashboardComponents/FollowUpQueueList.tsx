import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import FollowUpQueueItem from "@/src/sections/dashboardSections/FollowUpQueueItem";
import CardHeaderLink from "@/src/sections/dashboardSections/CardHeaderLink";
import { Skeleton } from "@/src/components/ui/Skeleton";
import type { FollowUpItem } from "@/src/data/dashboardData/followUpQueueData";

export default function FollowUpQueueList({
  items,
  isLoading,
}: {
  items: FollowUpItem[];
  isLoading: boolean;
}) {
  return (
    <ChartCard
      title="Follow-Up Queue"
      action={<CardHeaderLink label="Manage" href="/follow-ups" />}
    >
      <div className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))
          : items.map((item) => <FollowUpQueueItem key={item.id} item={item} />)}
      </div>
    </ChartCard>
  );
}
