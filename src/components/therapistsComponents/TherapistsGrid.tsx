import type { Therapist } from "@/src/services/therapistsService";
import TherapistCard from "@/src/sections/therapistsSections/TherapistCard";
import { ProfileCardGridSkeleton } from "@/src/components/ui/ProfileCardSkeleton";

export default function TherapistsGrid({
  therapists,
  isLoading,
}: {
  therapists: Therapist[];
  isLoading: boolean;
}) {
  if (isLoading && therapists.length === 0) {
    return <ProfileCardGridSkeleton count={6} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {therapists.map((therapist) => (
        <TherapistCard key={therapist.id} therapist={therapist} />
      ))}
    </div>
  );
}
