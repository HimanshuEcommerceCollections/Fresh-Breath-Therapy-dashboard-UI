import DashboardPageHeader from "@/src/components/dashboardComponents/DashboardPageHeader";
import LeadClientStatsRow from "@/src/components/dashboardComponents/LeadClientStatsRow";
import SessionMetricsRow from "@/src/components/dashboardComponents/SessionMetricsRow";
import RevenueMetricsRow from "@/src/components/dashboardComponents/RevenueMetricsRow";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 px-8 pb-12 pt-24">
      <DashboardPageHeader />
      <LeadClientStatsRow />
      <SessionMetricsRow />
      <RevenueMetricsRow />
    </div>
  );
}
