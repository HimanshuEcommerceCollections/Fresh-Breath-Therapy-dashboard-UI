// src/hooks/useTherapists.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  therapistsService,
  type AddTherapistPayload,
} from "@/src/services/therapistsService";
import { showSuccessToast } from "@/src/lib/toast";

export const useTherapists = () => {
  const queryClient = useQueryClient();

  const { data: therapists = [], isLoading, refetch } = useQuery({
    queryKey: ["therapists"],
    queryFn: () => therapistsService.fetchTherapists(),
  });

  const addTherapistMutation = useMutation({
    mutationFn: (payload: AddTherapistPayload) => therapistsService.addTherapist(payload),
    onSuccess: () => {
      showSuccessToast("Therapist created");
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
    },
  });

  return {
    therapists,
    isLoading,
    refetch,
    addTherapist: addTherapistMutation.mutateAsync,
  };
};
