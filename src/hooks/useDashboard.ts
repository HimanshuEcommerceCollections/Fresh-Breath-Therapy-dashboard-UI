// src/hooks/useDashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardData } from "@/src/services/dashboardService";

const EMPTY_DASHBOARD: DashboardData = {
  leadClientStats: [],
  sessionMetricsStats: [],
  revenueMetricsStats: [],
  revenueTrend: [],
  paymentStatus: [],
  leadFunnel: [],
  upcomingSessions: [],
  followUpQueue: [],
  therapistUtilization: [],
};

export const useDashboard = () => {
  const { data = EMPTY_DASHBOARD, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.fetchDashboard(),
  });

  return { ...data, isLoading };
};
