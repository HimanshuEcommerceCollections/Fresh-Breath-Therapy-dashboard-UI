// src/hooks/usePTODashboard.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { ptoService, type PTODashboardData } from "@/src/services/ptoService";

const EMPTY: PTODashboardData = {
  stats: { totalTherapists: 0, totalSessions: 0, ptoAccrued: 0, ptoUsed: 0, ptoBalance: 0 },
  byLocation: [],
  leaderboard: [],
};

export const usePTODashboard = () => {
  const { data = EMPTY, isLoading } = useQuery({
    queryKey: ["pto-dashboard"],
    queryFn: () => ptoService.fetchPTODashboard(),
  });

  return { ...data, isLoading };
};
