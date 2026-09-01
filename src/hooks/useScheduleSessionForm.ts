"use client";

// src/hooks/useScheduleSessionForm.ts
//
// Form state, validation, and submit logic for the Schedule Session modal.
// Date/time are native <input type="date"/"time"> values, which already come
// through as ISO "YYYY-MM-DD" / 24h "HH:MM" — exactly what the API expects,
// so no client-side parsing is needed.

import { useMemo, useState } from "react";
import type { ScheduleSessionPayload } from "@/src/services/sessionsService";
import type { SubjectValue } from "@/src/components/sharedComponents/SubjectSelect";

export const useScheduleSessionForm = (
  onSchedule: (payload: ScheduleSessionPayload) => Promise<void>,
  onSuccess: () => void,
  // Pre-selects the person when the modal is opened for one specific lead or
  // client — the "schedule a session for them" step straight after adding
  // someone. Read once as the initial state, deliberately: re-syncing it would
  // fight the admin if they changed the selection.
  initialSubject: SubjectValue = null,
) => {
  const [subject, setSubject] = useState<SubjectValue>(initialSubject);
  const [therapistId, setTherapistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      Boolean(subject?.id) &&
      therapistId.trim().length > 0 &&
      date.trim().length > 0 &&
      time.trim().length > 0 &&
      type.trim().length > 0,
    [subject, therapistId, date, time, type],
  );

  const handleSubmit = async () => {
    if (!isValid || isSubmitting || !subject) return;

    setIsSubmitting(true);
    try {
      await onSchedule({
        subjectId: subject.id,
        subjectKind: subject.kind,
        therapistId,
        date,
        time,
        type,
      });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSubject(initialSubject);
    setTherapistId("");
    setDate("");
    setTime("");
    setType("");
  };

  return {
    subject,
    setSubject,
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
