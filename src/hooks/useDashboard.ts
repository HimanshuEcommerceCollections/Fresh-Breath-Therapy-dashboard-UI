// src/hooks/useDashboard.ts
"use client";

import { useEffect, useState } from "react";
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
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    dashboardService
      .fetchDashboard()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch(() => {
        // Error toast already surfaced by the apiClient interceptor.
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { ...data, isLoading };
};
