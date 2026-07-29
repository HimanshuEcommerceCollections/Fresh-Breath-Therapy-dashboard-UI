"use client";

import DashboardPageHeader from "@/src/components/dashboardComponents/DashboardPageHeader";
import LeadClientStatsRow from "@/src/components/dashboardComponents/LeadClientStatsRow";
import SessionMetricsRow from "@/src/components/dashboardComponents/SessionMetricsRow";
import RevenueMetricsRow from "@/src/components/dashboardComponents/RevenueMetricsRow";
import ChartsRow from "@/src/components/dashboardComponents/ChartsRow";
import FunnelSessionsRow from "@/src/components/dashboardComponents/FunnelSessionsRow";
import FollowUpUtilizationRow from "@/src/components/dashboardComponents/FollowUpUtilizationRow";
import { useDashboard } from "@/src/hooks/useDashboard";
import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function Home() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const dashboard = useDashboard();

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-8 px-8 pb-12 pt-24">
      <DashboardPageHeader />
      <LeadClientStatsRow stats={dashboard.leadClientStats} isLoading={dashboard.isLoading} />
      <SessionMetricsRow stats={dashboard.sessionMetricsStats} isLoading={dashboard.isLoading} />
      <RevenueMetricsRow stats={dashboard.revenueMetricsStats} isLoading={dashboard.isLoading} />
      <ChartsRow
        revenueTrend={dashboard.revenueTrend}
        paymentStatus={dashboard.paymentStatus}
        isLoading={dashboard.isLoading}
      />
      <FunnelSessionsRow
        leadFunnel={dashboard.leadFunnel}
        upcomingSessions={dashboard.upcomingSessions}
        isLoading={dashboard.isLoading}
      />
      <FollowUpUtilizationRow
        followUpQueue={dashboard.followUpQueue}
        therapistUtilization={dashboard.therapistUtilization}
        isLoading={dashboard.isLoading}
      />
    </div>
  );
}
