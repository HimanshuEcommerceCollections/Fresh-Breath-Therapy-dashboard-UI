import { dayViewData } from "@/src/data/sessionsData/dayViewData";
import DayListItem from "@/src/sections/sessionsSections/DayListItem";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SessionsDayView({
  selectedDate,
}: {
  /** The date to display. Falls back to the static dayViewDate if not provided. */
  selectedDate?: Date;
}) {
  const dateLabel = selectedDate
    ? formatDate(selectedDate)
    : "Mon Jun 29 2026"; // fallback matches the existing static constant

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-base font-semibold leading-6 text-[#071123]">
        {dateLabel}
      </h3>
      <div className="flex flex-col">
        {dayViewData.map((session) => (
          <DayListItem
            key={`${session.time}-${session.client}`}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
