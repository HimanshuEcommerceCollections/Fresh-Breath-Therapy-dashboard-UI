import { monthViewData } from "@/src/data/sessionsData/monthViewData";
import MonthDayCell from "@/src/sections/sessionsSections/MonthDayCell";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// June 2026 starts on a Monday, so the Sunday-first grid needs one leading
// blank cell. TODO: derive from real date state once calendar math exists.
const LEADING_BLANK_CELLS = 1;

export default function SessionsMonthView() {
  const cells: (typeof monthViewData[number] | null)[] = [
    ...Array.from({ length: LEADING_BLANK_CELLS }, () => null),
    ...monthViewData,
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
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, index) => (
          <MonthDayCell key={day ? day.date : `blank-${index}`} day={day} />
        ))}
      </div>
    </div>
  );
}
