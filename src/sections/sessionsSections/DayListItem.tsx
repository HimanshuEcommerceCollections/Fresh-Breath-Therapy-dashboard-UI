import type { DaySession } from "@/src/data/sessionsData/dayViewData";
import { dayStatusColorData } from "@/src/data/sessionsData/dayStatusColorData";

export default function DayListItem({ session }: { session: DaySession }) {
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
      <span
        className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-4"
        style={{
          backgroundColor: pill.bg,
          borderColor: pill.border,
          color: pill.text,
        }}
      >
        {session.status}
      </span>
    </div>
  );
}
