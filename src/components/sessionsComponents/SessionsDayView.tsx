import { dayViewData, dayViewDate } from "@/src/data/sessionsData/dayViewData";
import DayListItem from "@/src/sections/sessionsSections/DayListItem";

export default function SessionsDayView() {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-base font-semibold leading-6 text-[#071123]">
        {dayViewDate}
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
