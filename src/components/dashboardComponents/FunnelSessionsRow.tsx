import LeadConversionFunnelChart from "@/src/components/dashboardComponents/LeadConversionFunnelChart";
import UpcomingSessionsList from "@/src/components/dashboardComponents/UpcomingSessionsList";
import type { FunnelStage } from "@/src/data/dashboardData/leadConversionFunnelData";
import type { UpcomingSession } from "@/src/data/dashboardData/upcomingSessionsData";

export default function FunnelSessionsRow({
  leadFunnel,
  upcomingSessions,
}: {
  leadFunnel: FunnelStage[];
  upcomingSessions: UpcomingSession[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-115">
        <LeadConversionFunnelChart data={leadFunnel} />
      </div>
      <UpcomingSessionsList sessions={upcomingSessions} />
    </div>
  );
}
