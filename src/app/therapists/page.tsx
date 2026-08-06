"use client";

import { useState } from "react";
import TherapistsPageHeader from "@/src/components/therapistsComponents/TherapistsPageHeader";
import TherapistsToolbar from "@/src/components/therapistsComponents/TherapistsToolbar";
import TherapistsGrid from "@/src/components/therapistsComponents/TherapistsGrid";
import TherapistFormModal from "@/src/sections/therapistsSections/TherapistFormModal";
import type { Therapist } from "@/src/services/therapistsService";
import { useTherapists } from "@/src/hooks/useTherapists";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { canWrite } from "@/src/lib/permissions";

export default function TherapistsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { role } = useCurrentUser();
  const { therapists, isLoading, addTherapist, updateTherapist } = useTherapists();
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <TherapistsPageHeader therapists={therapists} onCreate={addTherapist} />
      <TherapistsToolbar />
      <TherapistsGrid
        therapists={therapists}
        isLoading={isLoading}
        canEdit={canWrite(role)}
        onEdit={setEditingTherapist}
      />

      {/* Keyed on the therapist id so switching straight from one card's Edit
          to another remounts the form with the new record's values. */}
      {editingTherapist && (
        <TherapistFormModal
          key={editingTherapist.id}
          therapist={editingTherapist}
          onClose={() => setEditingTherapist(null)}
          onUpdate={updateTherapist}
        />
      )}
    </div>
  );
}
