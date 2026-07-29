import type { Session } from "@/src/services/sessionsService";
import DayListItem from "@/src/sections/sessionsSections/DayListItem";
import { ListSkeleton } from "@/src/components/ui/ListItemSkeleton";
import { formatDayLabel } from "@/src/lib/dateRanges";

export default function SessionsDayView({
  selectedDate,
  sessions,
  isLoading,
}: {
  selectedDate: Date;
  sessions: Session[];
  isLoading: boolean;
}) {
  const sorted = [...sessions].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-base font-semibold leading-6 text-[#071123]">
        {formatDayLabel(selectedDate)}
      </h3>
      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#94A3B8]">
          No sessions scheduled for this day.
        </p>
      ) : (
        <div className="flex flex-col">
          {sorted.map((session) => (
            <DayListItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
