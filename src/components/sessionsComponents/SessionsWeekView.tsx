import { weekViewData } from "@/src/data/sessionsData/weekViewData";
import WeekDayColumn from "@/src/sections/sessionsSections/WeekDayColumn";

export default function SessionsWeekView() {
  return (
    <div className="flex flex-row gap-3">
      {weekViewData.map((day) => (
        <WeekDayColumn key={`${day.label}-${day.date}`} day={day} />
      ))}
    </div>
  );
}
