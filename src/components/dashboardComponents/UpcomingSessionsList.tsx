import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import UpcomingSessionItem from "@/src/sections/dashboardSections/UpcomingSessionItem";
import CardHeaderLink from "@/src/sections/dashboardSections/CardHeaderLink";
import { upcomingSessionsData } from "@/src/data/dashboardData/upcomingSessionsData";

export default function UpcomingSessionsList() {
  return (
    <ChartCard
      title="Upcoming Sessions"
      action={<CardHeaderLink label="View all" />}
    >
      <div className="flex flex-col gap-3">
        {upcomingSessionsData.map((session) => (
          <UpcomingSessionItem key={session.id} session={session} />
        ))}
      </div>
    </ChartCard>
  );
}
