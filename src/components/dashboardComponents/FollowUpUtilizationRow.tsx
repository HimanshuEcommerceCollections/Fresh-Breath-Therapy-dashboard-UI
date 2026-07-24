import FollowUpQueueList from "@/src/components/dashboardComponents/FollowUpQueueList";
import TherapistUtilizationList from "@/src/components/dashboardComponents/TherapistUtilizationList";
import type { FollowUpItem } from "@/src/data/dashboardData/followUpQueueData";
import type { TherapistUtilization } from "@/src/data/dashboardData/therapistUtilizationData";

export default function FollowUpUtilizationRow({
  followUpQueue,
  therapistUtilization,
}: {
  followUpQueue: FollowUpItem[];
  therapistUtilization: TherapistUtilization[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <FollowUpQueueList items={followUpQueue} />
      <TherapistUtilizationList therapists={therapistUtilization} />
    </div>
  );
}
