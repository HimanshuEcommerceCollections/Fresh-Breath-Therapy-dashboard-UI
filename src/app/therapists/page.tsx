"use client";

import { useMemo, useState } from "react";
import TherapistsPageHeader from "@/src/components/therapistsComponents/TherapistsPageHeader";
import TherapistsToolbar from "@/src/components/therapistsComponents/TherapistsToolbar";
import TherapistsGrid from "@/src/components/therapistsComponents/TherapistsGrid";
import TherapistFormModal from "@/src/sections/therapistsSections/TherapistFormModal";
import type { Therapist } from "@/src/services/therapistsService";
import { useTherapists } from "@/src/hooks/useTherapists";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { canWrite } from "@/src/lib/permissions";

const ALL_LOCATIONS = "All locations";

export default function TherapistsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { role } = useCurrentUser();
  const { therapists, isLoading, addTherapist, updateTherapist } = useTherapists();
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [search, setSearch] = useState("");
  const [locationName, setLocationName] = useState(ALL_LOCATIONS);

  // `therapists` is already the complete, unpaginated roster (small
  // reference list by design), so search and the location filter run
  // entirely client-side against it — no request fires on every keystroke
  // or filter change.
  const filteredTherapists = useMemo(() => {
    const query = search.trim().toLowerCase();
    return therapists.filter((t) => {
      const matchesLocation = locationName === ALL_LOCATIONS || t.location.name === locationName;
      if (!matchesLocation) return false;
      if (!query) return true;
      return (
        t.name.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        (t.credential ?? "").toLowerCase().includes(query) ||
        (t.specialization ?? "").toLowerCase().includes(query)
      );
    });
  }, [therapists, search, locationName]);

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <TherapistsPageHeader therapists={therapists} onCreate={addTherapist} />
      <TherapistsToolbar
        search={search}
        onSearchChange={setSearch}
        locationName={locationName}
        onLocationNameChange={setLocationName}
      />
      <TherapistsGrid
        therapists={filteredTherapists}
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
