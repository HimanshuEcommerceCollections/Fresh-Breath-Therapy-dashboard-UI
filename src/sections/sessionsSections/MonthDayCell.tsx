import type { Session } from "@/src/services/sessionsService";

const MAX_VISIBLE_SESSIONS = 3;

export default function MonthDayCell({
  dateNumber,
  isToday,
  sessions,
  onDayClick,
}: {
  dateNumber: number | null;
  isToday: boolean;
  sessions: Session[];
  onDayClick?: (dateNumber: number) => void;
}) {
  if (dateNumber === null) {
    // Leading blank grid cell for days before the 1st of the month.
    return <div className="min-h-[110px]" />;
  }

  const visible = sessions.slice(0, MAX_VISIBLE_SESSIONS);
  const moreCount = sessions.length - visible.length;

  return (
    <div
      onClick={onDayClick ? () => onDayClick(dateNumber) : undefined}
      className={`flex min-h-[110px] flex-col gap-1 rounded-[4px] border p-1.5 ${
        isToday ? "border-[#376EF4]" : "border-[rgba(224,229,235,0.6)]"
      } ${onDayClick ? "cursor-pointer transition-colors hover:bg-[rgba(55,110,244,0.04)]" : ""}`}
    >
      <span className="text-xs font-semibold leading-3.5 tracking-[0.12px] text-[#596475]">
        {dateNumber}
      </span>
      {visible.map((session) => (
        <div
          key={session.id}
          className="rounded-[4px] bg-[rgba(55,110,244,0.1)] px-1 py-0.5 text-[11px] font-normal leading-3.5 tracking-[0.12px] text-[#376EF4]"
        >
          {session.time} {session.client}
        </div>
      ))}
      {moreCount > 0 && (
        <span className="text-[11px] font-normal leading-3.5 tracking-[0.12px] text-[#596475]">
          +{moreCount} more
        </span>
      )}
    </div>
  );
}
