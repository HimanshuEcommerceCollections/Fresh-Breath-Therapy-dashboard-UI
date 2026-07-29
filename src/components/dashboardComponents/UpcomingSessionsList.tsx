import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import UpcomingSessionItem from "@/src/sections/dashboardSections/UpcomingSessionItem";
import CardHeaderLink from "@/src/sections/dashboardSections/CardHeaderLink";
import { Skeleton } from "@/src/components/ui/Skeleton";
import type { UpcomingSession } from "@/src/data/dashboardData/upcomingSessionsData";

export default function UpcomingSessionsList({
  sessions,
  isLoading,
}: {
  sessions: UpcomingSession[];
  isLoading: boolean;
}) {
  return (
    <ChartCard
      title="Upcoming Sessions"
      action={<CardHeaderLink label="View all" />}
    >
      <div className="flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))
          : sessions.map((session) => (
              <UpcomingSessionItem key={session.id} session={session} />
            ))}
      </div>
    </ChartCard>
  );
}
