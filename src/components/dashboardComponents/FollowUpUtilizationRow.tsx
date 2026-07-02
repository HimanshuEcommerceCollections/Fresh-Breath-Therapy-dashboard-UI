import FollowUpQueueList from "@/src/components/dashboardComponents/FollowUpQueueList";
import TherapistUtilizationList from "@/src/components/dashboardComponents/TherapistUtilizationList";

export default function FollowUpUtilizationRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <FollowUpQueueList />
      <TherapistUtilizationList />
    </div>
  );
}
