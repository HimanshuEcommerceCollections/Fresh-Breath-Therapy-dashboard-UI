// src/hooks/useDashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService, type DashboardData } from "@/src/services/dashboardService";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

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
  // GET /api/dashboard is Admin/Coordinator-only backend-side (403 for
  // Therapist). The Home page redirects Therapists to /leads via
  // useRequireRole, but that redirect only lands after CurrentUserProvider's
  // own /api/auth/me call resolves — without gating on role here too, this
  // query would fire immediately on mount regardless, wasting a request that
  // errors out for a Therapist in the brief window before the redirect.
  const { role, hasChecked } = useCurrentUser();
  const isAllowed = hasChecked && role !== null && role !== "Therapist";

  const { data = EMPTY_DASHBOARD, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.fetchDashboard(),
    enabled: isAllowed,
  });

  return { ...data, isLoading: isLoading && isAllowed };
};
