"use client";

import TherapistsPageHeader from "@/src/components/therapistsComponents/TherapistsPageHeader";
import TherapistsToolbar from "@/src/components/therapistsComponents/TherapistsToolbar";
import TherapistsGrid from "@/src/components/therapistsComponents/TherapistsGrid";
import { useTherapists } from "@/src/hooks/useTherapists";

export default function TherapistsPage() {
  const { therapists, isLoading, addTherapist } = useTherapists();

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <TherapistsPageHeader therapists={therapists} onCreate={addTherapist} />
      <TherapistsToolbar />
      <TherapistsGrid therapists={therapists} isLoading={isLoading} />
    </div>
  );
}
