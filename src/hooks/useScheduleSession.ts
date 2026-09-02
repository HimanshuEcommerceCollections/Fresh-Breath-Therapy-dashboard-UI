"use client";

// src/hooks/useScheduleSession.ts
//
// Just enough to schedule a session, extracted from useSessionsPage so the
// Schedule Session modal can be opened from anywhere — in particular straight
// after adding a lead or client, which is the whole point of that flow.
//
// useSessionsPage is ~300 lines of calendar navigation, therapist filtering and
// search state. Mounting all of it inside a modal on the Leads page would run
// several queries that screen has no use for.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsService, type ScheduleSessionPayload } from "@/src/services/sessionsService";
import { showSuccessToast } from "@/src/lib/toast";

/** Every cache a scheduled session invalidates. Shared with useSessionsPage so
 *  the two cannot drift — scheduling writes a PAYMENT in the same transaction,
 *  and forgetting that leaves the Payments page and every revenue figure
 *  serving a cache from before the money existed. */
export const invalidateAfterScheduling = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: ["sessions"] });
  queryClient.invalidateQueries({ queryKey: ["payments"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  // Session counts and lifetime value on the Clients page derive from both.
  queryClient.invalidateQueries({ queryKey: ["clients"] });
};

export const useScheduleSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ScheduleSessionPayload) =>
      sessionsService.scheduleSession(payload),
    onSuccess: () => {
      showSuccessToast("Session scheduled");
      invalidateAfterScheduling(queryClient);
    },
  });

  return {
    scheduleSession: async (payload: ScheduleSessionPayload) => {
      await mutation.mutateAsync(payload);
    },
    isScheduling: mutation.isPending,
  };
};
