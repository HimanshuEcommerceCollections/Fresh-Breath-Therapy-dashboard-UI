import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";
import { statusColorData } from "@/src/data/followUpsData/statusColorData";

export default function StatusPill({ status }: { status: FollowUpStatus }) {
  const colors = statusColorData[status];

  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium leading-4"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {status}
    </span>
  );
}
