import LeadConversionFunnelChart from "@/src/components/dashboardComponents/LeadConversionFunnelChart";
import UpcomingSessionsList from "@/src/components/dashboardComponents/UpcomingSessionsList";

export default function FunnelSessionsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-115">
        <LeadConversionFunnelChart />
      </div>
      <UpcomingSessionsList />
    </div>
  );
}
