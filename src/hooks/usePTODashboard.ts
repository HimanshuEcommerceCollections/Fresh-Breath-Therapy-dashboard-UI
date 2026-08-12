// src/hooks/usePTODashboard.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ptoService, type PTODashboardData } from "@/src/services/ptoService";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { showSuccessToast } from "@/src/lib/toast";

const EMPTY: PTODashboardData = {
  stats: { totalTherapists: 0, totalSessions: 0, ptoAccrued: 0, ptoUsed: 0, ptoBalance: 0 },
  byLocation: [],
  leaderboard: [],
};

const SEARCH_DEBOUNCE_MS = 250;

export const usePTODashboard = () => {
  const queryClient = useQueryClient();
  const { data = EMPTY, isLoading } = useQuery({
    queryKey: ["pto-dashboard"],
    queryFn: () => ptoService.fetchPTODashboard(),
  });

  // Filtered client-side, not via the API. GET /api/pto returns the whole
  // leaderboard in one payload anyway — it has to, because ranking by balance
  // is only meaningful over the full set — so a round trip per keystroke would
  // buy nothing. The debounce is still here so a long roster doesn't re-filter
  // and re-render on every character.
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const filteredLeaderboard = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return data.leaderboard;
    // Every word must appear somewhere across name, credential and location,
    // so "chen downtown" separates two therapists who share a name — the same
    // rule the therapist pickers use.
    const words = q.split(/\s+/);
    return data.leaderboard.filter((entry) => {
      const haystack = `${entry.name} ${entry.credential ?? ""} ${entry.location}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [data.leaderboard, debouncedSearch]);

  const recordUsageMutation = useMutation({
    mutationFn: ptoService.recordPTOUsage,
    onSuccess: () => {
      showSuccessToast("PTO usage recorded");
      // Balances, the location chart and the org-wide totals all move on a
      // single usage entry, so the whole dashboard query is invalidated.
      queryClient.invalidateQueries({ queryKey: ["pto-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["pto-transactions"] });
    },
  });

  return {
    ...data,
    // Everything below the search box reads the filtered list; the stat cards
    // and the location chart keep reading the unfiltered one, since they are
    // org-wide figures that a name search shouldn't silently rewrite.
    filteredLeaderboard,
    isLoading,
    search,
    setSearch,
    isSearching: search !== debouncedSearch,
    recordUsage: recordUsageMutation.mutateAsync,
    isRecordingUsage: recordUsageMutation.isPending,
  };
};

/** One therapist's PTO ledger. Enabled only while a panel is actually open. */
export const useTherapistPTOTransactions = (therapistId: string | null) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["pto-transactions", therapistId],
    queryFn: () => ptoService.fetchTherapistTransactions(therapistId as string),
    enabled: Boolean(therapistId),
  });
  return { transactions: data, isLoading };
};
