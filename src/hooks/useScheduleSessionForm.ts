"use client";

// src/hooks/useScheduleSessionForm.ts
//
// Form state, validation, and submit logic for the Schedule Session modal.

import { useMemo, useState } from "react";
import type { ScheduleSessionPayload } from "@/src/services/sessionsService";

// Date/time inputs are free-text DD/MM/YYYY and h:mm AM/PM (no picker exists
// yet — a pre-existing limitation, not introduced here). Converts to the
// ISO "YYYY-MM-DD" / 24h "HH:MM" the real API expects.
function toIsoDate(ddmmyyyy: string): string | null {
  const match = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function to24HourTime(hmmAmPm: string): string | null {
  const match = hmmAmPm.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let [, hourStr, minute, meridiem] = match;
  let hour = parseInt(hourStr, 10);
  if (meridiem.toUpperCase() === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export const useScheduleSessionForm = (
  onSchedule: (payload: ScheduleSessionPayload) => Promise<void>,
  onSuccess: () => void
) => {
  const [clientId, setClientId] = useState("");
  const [therapistId, setTherapistId] = useState("");
  const [date, setDate] = useState("25/06/2026");
  const [time, setTime] = useState("10:00 AM");
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
    const isoDate = toIsoDate(date);
    const time24 = to24HourTime(time);
    if (!isoDate || !time24) return;

    setIsSubmitting(true);
    try {
      await onSchedule({ clientId, therapistId, date: isoDate, time: time24, type });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setClientId("");
    setTherapistId("");
    setDate("25/06/2026");
    setTime("10:00 AM");
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
