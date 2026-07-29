import type { Session } from "@/src/services/sessionsService";
import WeekDayColumn from "@/src/sections/sessionsSections/WeekDayColumn";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { addDays, getWeekRange, toISODate } from "@/src/lib/dateRanges";

const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function SessionsWeekView({
  selectedDate,
  sessions,
  isLoading,
}: {
  selectedDate: Date;
  sessions: Session[];
  isLoading: boolean;
}) {
  const { start } = getWeekRange(selectedDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  if (isLoading) {
    return (
      <div className="flex flex-row gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-40 flex-1" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3">
      {days.map((day, i) => {
        const iso = toISODate(day);
        const daySessions = sessions.filter((s) => s.date === iso);
        return (
          <WeekDayColumn
            key={iso}
            label={WEEKDAY_LABELS[i]}
            dateNumber={day.getDate()}
            sessions={daySessions}
          />
        );
      })}
    </div>
  );
}
