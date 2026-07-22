"use client";

// src/hooks/useScheduleSessionForm.ts
//
// Form state, validation, and submit logic for the Schedule Session modal.
// Mirrors the useAddTherapistForm pattern — keeps all side effects (service
// call, success callback) here so the component stays presentation-only.
//
// "client" is stored as a client ID (from clientsData) so the rest of the app
// can reference the client by their stable identifier. The display name is
// derived at submit time.

import { useMemo, useState } from "react";
import { sessionsService } from "@/src/services/sessionsService";
import { clientsData } from "@/src/data/clientsData/clientsData";

export const useScheduleSessionForm = (onSuccess: () => void) => {
  const [clientId, setClientId] = useState("");
  const [therapist, setTherapist] = useState("");
  const [date, setDate] = useState("25/06/2026");
  const [time, setTime] = useState("10:00 AM");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      clientId.trim().length > 0 &&
      therapist.trim().length > 0 &&
      date.trim().length > 0 &&
      time.trim().length > 0 &&
      type.trim().length > 0,
    [clientId, therapist, date, time, type],
  );

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const clientName =
        clientsData.find((c) => c.id === clientId)?.name ?? clientId;
      const payload = { client: clientName, therapist, date, time, type };
      const res = await sessionsService.scheduleSession(payload);
      if (res.success) {
        // TODO: insert into sessionsData once it's stateful.
        console.log("New session scheduled:", payload);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setClientId("");
    setTherapist("");
    setDate("25/06/2026");
    setTime("10:00 AM");
    setType("");
  };

  return {
    clientId,
    setClientId,
    therapist,
    setTherapist,
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
