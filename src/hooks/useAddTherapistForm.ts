// src/hooks/useAddTherapistForm.ts
"use client";

import { useMemo, useState } from "react";
import { therapistsService } from "@/src/services/therapistsService";

export const useAddTherapistForm = (onSuccess: () => void) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [clinic, setClinic] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      clinic.length > 0 &&
      employmentStatus.length > 0,
    [fullName, email, clinic, employmentStatus]
  );

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        fullName,
        email,
        credential,
        specialization,
        clinic,
        employmentStatus,
      };
      const res = await therapistsService.addTherapist(payload);
      if (res.success) {
        // TODO: insert into therapistsData once it's stateful.
        console.log("New therapist:", payload);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    credential,
    setCredential,
    specialization,
    setSpecialization,
    clinic,
    setClinic,
    employmentStatus,
    setEmploymentStatus,
    isValid,
    isSubmitting,
    handleSubmit,
  };
};
