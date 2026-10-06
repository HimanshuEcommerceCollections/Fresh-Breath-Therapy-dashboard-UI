// src/hooks/useTherapists.ts
"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  therapistsService,
  type AddTherapistPayload,
  type UpdateTherapistPayload,
} from "@/src/services/therapistsService";

// How long a freshly added therapist's card shows its success tick.
const JUST_ADDED_MS = 5000;

// A therapist being added right now: "saving" while the request is in
// flight (a placeholder card with a spinner), then "saved" with the real id
// for JUST_ADDED_MS (the card shows a tick), then gone.
export interface RecentTherapistAdd {
  key: string;
  status: "saving" | "saved";
  name: string;
  email: string;
  therapistId?: string;
}
import { showSuccessToast } from "@/src/lib/toast";

export const useTherapists = () => {
  const queryClient = useQueryClient();
  const [recentAdds, setRecentAdds] = useState<RecentTherapistAdd[]>([]);

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
    recentAdds,
    addTherapist: async (payload: AddTherapistPayload) => {
      const key = crypto.randomUUID();
      setRecentAdds((prev) => [
        ...prev,
        { key, status: "saving", name: payload.name, email: payload.email },
      ]);
      try {
        const created = await addTherapistMutation.mutateAsync(payload);
        setRecentAdds((prev) =>
          prev.map((a) => (a.key === key ? { ...a, status: "saved", therapistId: created.id } : a))
        );
        setTimeout(
          () => setRecentAdds((prev) => prev.filter((a) => a.key !== key)),
          JUST_ADDED_MS
        );
        return created;
      } catch (error) {
        // The error itself is already toasted by apiClient.
        setRecentAdds((prev) => prev.filter((a) => a.key !== key));
        throw error;
      }
    },
    updateTherapist: (id: string, payload: UpdateTherapistPayload) =>
      updateTherapistMutation.mutateAsync({ id, payload }),
  };
};
