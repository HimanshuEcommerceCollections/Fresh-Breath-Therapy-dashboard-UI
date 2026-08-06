// src/hooks/useTherapists.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  therapistsService,
  type AddTherapistPayload,
  type UpdateTherapistPayload,
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

  const updateTherapistMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTherapistPayload }) =>
      therapistsService.updateTherapist(id, payload),
    onSuccess: () => {
      showSuccessToast("Therapist updated");
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
      // Therapist name/clinic is denormalised into these views.
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    therapists,
    isLoading,
    refetch,
    addTherapist: addTherapistMutation.mutateAsync,
    updateTherapist: (id: string, payload: UpdateTherapistPayload) =>
      updateTherapistMutation.mutateAsync({ id, payload }),
  };
};
