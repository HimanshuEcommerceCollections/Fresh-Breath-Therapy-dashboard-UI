"use client";

// src/hooks/useScheduleSessionForm.ts
//
// Form state, validation, and submit logic for the Schedule Session modal.
// Date/time are native <input type="date"/"time"> values, which already come
// through as ISO "YYYY-MM-DD" / 24h "HH:MM" — exactly what the API expects,
// so no client-side parsing is needed.

import { useMemo, useState } from "react";
import type { ScheduleSessionPayload } from "@/src/services/sessionsService";

export const useScheduleSessionForm = (
  onSchedule: (payload: ScheduleSessionPayload) => Promise<void>,
  onSuccess: () => void
) => {
  const [clientId, setClientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      clientId.trim().length > 0 &&
      therapistId.trim().length > 0 &&
      date.trim().length > 0 &&
      time.trim().length > 0 &&
      type.trim().length > 0,
    [clientId, therapistId, date, time, type],
  );

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSchedule({ clientId, therapistId, date, time, type });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setClientId("");
    setTherapistId("");
    setDate("");
    setTime("");
    setType("");
  };

  return {
    clientId,
    setClientId,
    therapistId,
    setTherapistId,
    date,
    setDate,
    time,
    setTime,
    type,
    setType,
    isValid,
    isSubmitting,
    handleSubmit,
    reset,
  };
};
