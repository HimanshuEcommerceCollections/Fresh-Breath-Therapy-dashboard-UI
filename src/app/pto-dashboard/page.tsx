import PTODashboardPageHeader from "@/src/components/ptoDashboardComponents/PTODashboardPageHeader";
import PTOStatsRow from "@/src/components/ptoDashboardComponents/PTOStatsRow";
import PTOChartsRow from "@/src/components/ptoDashboardComponents/PTOChartsRow";
import TherapistLeaderboardTable from "@/src/components/ptoDashboardComponents/TherapistLeaderboardTable";

export default function PTODashboardPage() {
  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PTODashboardPageHeader />
      <PTOStatsRow />
      <PTOChartsRow />
      <TherapistLeaderboardTable />
    </div>
  );
}
