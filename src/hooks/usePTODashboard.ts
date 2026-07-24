// src/hooks/usePTODashboard.ts
"use client";

import { useEffect, useState } from "react";
import { ptoService, type PTODashboardData } from "@/src/services/ptoService";

const EMPTY: PTODashboardData = {
  stats: { totalTherapists: 0, totalSessions: 0, ptoAccrued: 0, ptoUsed: 0, ptoBalance: 0 },
  byLocation: [],
  leaderboard: [],
};

export const usePTODashboard = () => {
  const [data, setData] = useState<PTODashboardData>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    ptoService
      .fetchPTODashboard()
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
