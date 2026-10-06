import type { Therapist } from "@/src/services/therapistsService";
import type { RecentTherapistAdd } from "@/src/hooks/useTherapists";
import TherapistCard from "@/src/sections/therapistsSections/TherapistCard";
import PendingTherapistCard from "@/src/sections/therapistsSections/PendingTherapistCard";
import { ProfileCardGridSkeleton } from "@/src/components/ui/ProfileCardSkeleton";

export default function TherapistsGrid({
  therapists,
  isLoading,
  canEdit = false,
  onEdit,
  recentAdds = [],
}: {
  therapists: Therapist[];
  isLoading: boolean;
  canEdit?: boolean;
  onEdit?: (therapist: Therapist) => void;
  /** Therapists being added right now — see useTherapists. */
  recentAdds?: RecentTherapistAdd[];
}) {
  if (isLoading && therapists.length === 0 && recentAdds.length === 0) {
    return <ProfileCardGridSkeleton count={6} />;
  }

  // Just-added therapists lead the grid, so the card the admin is watching
  // doesn't jump from the front (placeholder) to wherever the roster sorts it.
  const justAddedIds = new Set(
    recentAdds.filter((a) => a.status === "saved").map((a) => a.therapistId)
  );
  const byId = new Map(therapists.map((t) => [t.id, t]));
  const rest = therapists.filter((t) => !justAddedIds.has(t.id));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recentAdds.map((add) => {
        const real = add.therapistId ? byId.get(add.therapistId) : undefined;
        // Saved and back in the roster: the real card, with its tick.
        return real ? (
          <TherapistCard
            key={add.key}
            therapist={real}
            canEdit={canEdit}
            onEdit={onEdit}
            justAdded
          />
        ) : (
          <PendingTherapistCard key={add.key} add={add} />
        );
      })}
      {rest.map((therapist) => (
        <TherapistCard
          key={therapist.id}
          therapist={therapist}
          canEdit={canEdit}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
