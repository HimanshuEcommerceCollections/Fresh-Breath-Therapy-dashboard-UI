// src/hooks/useTherapistForm.ts
"use client";

import { useMemo, useState } from "react";
import {
  therapistsService,
  type AddTherapistPayload,
  type Therapist,
  type UpdateTherapistPayload,
} from "@/src/services/therapistsService";
import { emailError, nameError } from "@/src/lib/validation";

// Backs both Add and Edit Therapist. Passing an existing therapist puts it in
// edit mode: fields start from that record and submit PATCHes only what
// actually changed, so an untouched field is never overwritten (and PATCH
// treats an explicit null as "clear this", which would silently wipe values).
export const useTherapistForm = ({
  therapist,
  onCreate,
  onUpdate,
  onSuccess,
}: {
  therapist?: Therapist;
  onCreate?: (payload: AddTherapistPayload) => Promise<Therapist>;
  onUpdate?: (id: string, payload: UpdateTherapistPayload) => Promise<Therapist>;
  onSuccess: () => void;
}) => {
  const isEdit = Boolean(therapist);

  const [fullName, setFullName] = useState(therapist?.name ?? "");
  const [email, setEmail] = useState(therapist?.email ?? "");
  const [credential, setCredential] = useState(therapist?.credential ?? "");
  const [specialization, setSpecialization] = useState(therapist?.specialization ?? "");
  const [employmentStatus, setEmploymentStatus] = useState(therapist?.employmentStatus ?? "");
  const [locationId, setLocationId] = useState(therapist?.location.id ?? "");
  const [isActive, setIsActive] = useState(therapist?.isActive ?? true);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    therapist?.avatarUrl ?? undefined
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameErr = nameError(fullName);
  const emailErr = emailError(email);

  const isValid = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      locationId.length > 0 &&
      !nameError(fullName) &&
      !emailError(email),
    [fullName, email, locationId]
  );

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      setAvatarUrl(await therapistsService.uploadAvatar(file));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isEdit && therapist && onUpdate) {
        const changes: UpdateTherapistPayload = {};
        if (fullName !== therapist.name) changes.name = fullName;
        if (email !== therapist.email) changes.email = email;
        if ((credential || null) !== therapist.credential)
          changes.credential = credential || null;
        if ((specialization || null) !== therapist.specialization)
          changes.specialization = specialization || null;
        if ((employmentStatus || null) !== therapist.employmentStatus)
          changes.employmentStatus = employmentStatus || null;
        if (locationId !== therapist.location.id) changes.locationId = locationId;
        if (isActive !== therapist.isActive) changes.isActive = isActive;
        if ((avatarUrl ?? null) !== therapist.avatarUrl)
          changes.avatarUrl = avatarUrl ?? null;

        // Nothing edited — skip the round trip rather than PATCHing an empty body.
        if (Object.keys(changes).length > 0) {
          await onUpdate(therapist.id, changes);
        }
      } else if (onCreate) {
        await onCreate({
          name: fullName,
          credential: credential || undefined,
          specialization: specialization || undefined,
          employmentStatus: employmentStatus || undefined,
          locationId,
          email,
          avatarUrl,
        });
      }
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEdit,
    nameErr,
    emailErr,
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
    isActive,
    setIsActive,
    avatarUrl,
    isUploadingAvatar,
    handleAvatarUpload,
    isValid,
    isSubmitting,
    handleSubmit,
  };
};
