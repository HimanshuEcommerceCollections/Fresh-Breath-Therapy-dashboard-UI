"use client";

import DashboardPageHeader from "@/src/components/dashboardComponents/DashboardPageHeader";
import LeadClientStatsRow from "@/src/components/dashboardComponents/LeadClientStatsRow";
import SessionMetricsRow from "@/src/components/dashboardComponents/SessionMetricsRow";
import RevenueMetricsRow from "@/src/components/dashboardComponents/RevenueMetricsRow";
import ChartsRow from "@/src/components/dashboardComponents/ChartsRow";
import FunnelSessionsRow from "@/src/components/dashboardComponents/FunnelSessionsRow";
import FollowUpUtilizationRow from "@/src/components/dashboardComponents/FollowUpUtilizationRow";
import { useDashboard } from "@/src/hooks/useDashboard";

export default function Home() {
  const dashboard = useDashboard();

  return (
    <div className="flex flex-col gap-8 px-8 pb-12 pt-24">
      <DashboardPageHeader />
      <LeadClientStatsRow stats={dashboard.leadClientStats} />
      <SessionMetricsRow stats={dashboard.sessionMetricsStats} />
      <RevenueMetricsRow stats={dashboard.revenueMetricsStats} />
      <ChartsRow revenueTrend={dashboard.revenueTrend} paymentStatus={dashboard.paymentStatus} />
      <FunnelSessionsRow leadFunnel={dashboard.leadFunnel} upcomingSessions={dashboard.upcomingSessions} />
      <FollowUpUtilizationRow
        followUpQueue={dashboard.followUpQueue}
        therapistUtilization={dashboard.therapistUtilization}
      />
    </div>
  );
}
