// src/hooks/useFeatureFlags.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  featureFlagsService,
  type FeatureFlag,
  type FeatureFlagCategory,
} from "@/src/services/settingsService";

export const useFeatureFlags = (category: FeatureFlagCategory) => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await featureFlagsService.fetchFlags(category);
      setFlags(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (flagId: string, enabled: boolean) => {
    // Optimistic update — flip immediately, reconcile with the server response.
    setFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, enabled } : f)));
    try {
      const updated = await featureFlagsService.setEnabled(flagId, enabled);
      setFlags((prev) => prev.map((f) => (f.id === flagId ? updated : f)));
    } catch {
      // Revert on failure — error toast already surfaced by the interceptor.
      setFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, enabled: !enabled } : f)));
    }
  };

  return { flags, isLoading, toggle };
};
