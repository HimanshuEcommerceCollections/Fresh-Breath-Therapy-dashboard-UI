import { Pencil } from "lucide-react";
import type { Session } from "@/src/services/sessionsService";
import { dayStatusColorData } from "@/src/data/sessionsData/dayStatusColorData";

export default function DayListItem({
  session,
  onEdit,
}: {
  session: Session;
  onEdit?: (session: Session) => void;
}) {
  const pill = dayStatusColorData[session.status];

  return (
    <div className="flex items-center justify-between border-b border-[#E0E5EB] py-2 last:border-b-0">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-semibold leading-5 text-[#071123]">
          {session.time} — {session.client}
        </span>
        <span className="truncate text-xs font-normal leading-4 text-[#596475]">
          {session.type} · {session.therapist}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-4"
          style={{
            backgroundColor: pill.bg,
            borderColor: pill.border,
            color: pill.text,
          }}
        >
          {session.status}
        </span>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(session)}
            aria-label={`Edit ${session.client}'s session`}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#376EF4] transition-colors hover:bg-[#F5F8FF]"
          >
            <Pencil size={12} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
