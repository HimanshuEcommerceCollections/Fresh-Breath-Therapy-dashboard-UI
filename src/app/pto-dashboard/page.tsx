"use client";

import PTODashboardPageHeader from "@/src/components/ptoDashboardComponents/PTODashboardPageHeader";
import PTOStatsRow from "@/src/components/ptoDashboardComponents/PTOStatsRow";
import PTOChartsRow from "@/src/components/ptoDashboardComponents/PTOChartsRow";
import TherapistLeaderboardTable from "@/src/components/ptoDashboardComponents/TherapistLeaderboardTable";
import { usePTODashboard } from "@/src/hooks/usePTODashboard";

export default function PTODashboardPage() {
  const { stats, byLocation, leaderboard } = usePTODashboard();

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PTODashboardPageHeader />
      <PTOStatsRow stats={stats} />
      <PTOChartsRow byLocation={byLocation} />
      <TherapistLeaderboardTable leaderboard={leaderboard} />
    </div>
  );
}
