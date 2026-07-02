import type { MonthDay } from "@/src/data/sessionsData/monthViewData";

export default function MonthDayCell({ day }: { day: MonthDay | null }) {
  if (day === null) {
    // Leading blank grid cell for days before the 1st of the month.
    return <div className="min-h-[110px]" />;
  }

  return (
    <div
      className={`flex min-h-[110px] flex-col gap-1 rounded-[4px] border p-1.5 ${
        day.isToday ? "border-[#376EF4]" : "border-[rgba(224,229,235,0.6)]"
      }`}
    >
      <span className="text-xs font-semibold leading-3.5 tracking-[0.12px] text-[#596475]">
        {day.date}
      </span>
      {day.sessions.map((session, index) => (
        <div
          key={`${session.time}-${session.firstName}-${index}`}
          className="rounded-[4px] bg-[rgba(55,110,244,0.1)] px-1 py-0.5 text-[11px] font-normal leading-3.5 tracking-[0.12px] text-[#376EF4]"
        >
          {session.time} {session.firstName}
        </div>
      ))}
      {day.moreCount !== undefined && (
        <span className="text-[11px] font-normal leading-3.5 tracking-[0.12px] text-[#596475]">
          +{day.moreCount} more
        </span>
      )}
    </div>
  );
}
