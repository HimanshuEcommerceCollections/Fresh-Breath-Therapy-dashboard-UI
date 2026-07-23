import type { Therapist } from "@/src/services/therapistsService";
import TherapistCard from "@/src/sections/therapistsSections/TherapistCard";

export default function TherapistsGrid({
  therapists,
  isLoading,
}: {
  therapists: Therapist[];
  isLoading: boolean;
}) {
  if (isLoading && therapists.length === 0) {
    return <p className="text-sm text-[#596475]">Loading therapists…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {therapists.map((therapist) => (
        <TherapistCard key={therapist.id} therapist={therapist} />
      ))}
    </div>
  );
}
