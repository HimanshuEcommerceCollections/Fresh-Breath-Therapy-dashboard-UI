// src/hooks/useAddTherapistForm.ts
"use client";

import { useMemo, useState } from "react";
import { therapistsService, type AddTherapistPayload, type Therapist } from "@/src/services/therapistsService";

export const useAddTherapistForm = (
  onCreate: (payload: AddTherapistPayload) => Promise<Therapist>,
  onSuccess: () => void
) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  // MISMATCH: kept in the UI, but the backend Therapist model has no
  // specialization/employment-status field — not sent on submit. Flagged in
  // the Therapists integration report rather than silently dropped from the UI.
  const [specialization, setSpecialization] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [locationId, setLocationId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      locationId.length > 0,
    [fullName, email, locationId]
  );

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const url = await therapistsService.uploadAvatar(file);
      setAvatarUrl(url);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreate({
        name: fullName,
        credential: credential || undefined,
        locationId,
        email,
        avatarUrl,
      });
      onSuccess();
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
    employmentStatus,
    setEmploymentStatus,
    locationId,
    setLocationId,
    avatarUrl,
    isUploadingAvatar,
    handleAvatarUpload,
    isValid,
    isSubmitting,
    handleSubmit,
  };
};
