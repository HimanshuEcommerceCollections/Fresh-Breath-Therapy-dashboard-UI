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
import {
  paymentMethodOptions,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";

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

  // ── the session's payment ───────────────────────────────────────────────
  // Not optional. The backend writes both rows in one transaction, so there
  // is no such thing as a session without one. An unbilled session is
  // Pending, which is the default here.
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(paymentMethodOptions[0]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Pending");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mirrors the API's gt=0. A zero-amount Pending row would sit in the
  // outstanding figure forever contributing nothing.
  const numericAmount = Number(amount);
  const isAmountValid =
    amount.trim() !== "" && Number.isFinite(numericAmount) && numericAmount > 0;

  const isValid = useMemo(
    () =>
      Boolean(subject?.id) &&
      therapistId.trim().length > 0 &&
      date.trim().length > 0 &&
      time.trim().length > 0 &&
      type.trim().length > 0 &&
      isAmountValid,
    [subject, therapistId, date, time, type, isAmountValid],
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
        payment: { amount: numericAmount, method, status: paymentStatus },
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
    setAmount("");
    setMethod(paymentMethodOptions[0]);
    setPaymentStatus("Pending");
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
    amount,
    setAmount,
    isAmountValid,
    method,
    setMethod,
    paymentStatus,
    setPaymentStatus,
    isValid,
    isSubmitting,
    handleSubmit,
    reset,
  };
};
