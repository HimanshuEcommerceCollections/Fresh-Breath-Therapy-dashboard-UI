import type { Session } from "@/src/services/sessionsService";
import MonthDayCell from "@/src/sections/sessionsSections/MonthDayCell";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { getMonthRange, isSameDay, toISODate } from "@/src/lib/dateRanges";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function SessionsMonthView({
  selectedDate,
  sessions,
  isLoading,
  onDayClick,
}: {
  selectedDate: Date;
  sessions: Session[];
  isLoading: boolean;
  /** Called when the user clicks a day cell; receives the day number (1-31). */
  onDayClick?: (dateNumber: number) => void;
}) {
  const { start, end } = getMonthRange(selectedDate);
  const daysInMonth = end.getDate();
  const leadingBlankCells = start.getDay(); // 0 = Sunday-first grid alignment
  const today = new Date();

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlankCells }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1)
    ),
  ];

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-2 py-1 text-[11px] font-medium uppercase leading-4 tracking-[0.066px] text-[#596475]"
          >
            {label}
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-7 gap-px">
          {cells.map((day, index) => (
            <Skeleton
              key={day ? toISODate(day) : `blank-${index}`}
              className="min-h-[110px] rounded-[4px]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-px">
          {cells.map((day, index) => (
            <MonthDayCell
              key={day ? toISODate(day) : `blank-${index}`}
              dateNumber={day ? day.getDate() : null}
              isToday={day !== null && isSameDay(day, today)}
              sessions={day ? sessions.filter((s) => s.date === toISODate(day)) : []}
              onDayClick={onDayClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
