import type { Session } from "@/src/services/sessionsService";

export default function WeekDayColumn({
  label,
  dateNumber,
  sessions,
  onClick,
}: {
  label: string;
  dateNumber: number;
  sessions: Session[];
  /** Opens Day view for this date — the whole column is the target, so a
   *  click anywhere in the empty space below the pills works too. */
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 cursor-pointer flex-col rounded-[18px] border border-[#E0E5EB] bg-white p-3 text-left shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:border-[#376EF4] hover:bg-[#F7FBFD]">
      <span className="text-xs font-semibold uppercase leading-4 text-[#596475]">
        {label}
      </span>
      <span className="mt-3 text-base font-semibold leading-7 text-[#071123]">
        {dateNumber}
      </span>

      <div className="mt-2 flex flex-col gap-1.5">
        {sessions.length === 0 ? (
          <span className="text-xs font-normal leading-4 text-[#596475]">—</span>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[4px] bg-[rgba(55,110,244,0.1)] p-1.5 text-[11px] font-semibold leading-4 text-[#376EF4]"
            >
              {session.time} · {session.subject.name}
            </div>
          ))
        )}
      </div>
    </button>
  );
}
