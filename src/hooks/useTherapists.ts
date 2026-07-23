// src/hooks/useTherapists.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  therapistsService,
  type Therapist,
  type AddTherapistPayload,
} from "@/src/services/therapistsService";
import { showSuccessToast } from "@/src/lib/toast";

export const useTherapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await therapistsService.fetchTherapists();
      setTherapists(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addTherapist = async (payload: AddTherapistPayload) => {
    const therapist = await therapistsService.addTherapist(payload);
    showSuccessToast("Therapist created");
    setTherapists((prev) => [...prev, therapist]);
    return therapist;
  };

  return { therapists, isLoading, refetch, addTherapist };
};
