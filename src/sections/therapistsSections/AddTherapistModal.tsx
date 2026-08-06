"use client";

// Thin wrapper kept so existing call sites don't change — the form itself now
// lives in TherapistFormModal, shared with the Edit flow.
import TherapistFormModal from "@/src/sections/therapistsSections/TherapistFormModal";
import type { AddTherapistPayload, Therapist } from "@/src/services/therapistsService";

export default function AddTherapistModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (payload: AddTherapistPayload) => Promise<Therapist>;
}) {
  return <TherapistFormModal onClose={onClose} onCreate={onCreate} />;
}
