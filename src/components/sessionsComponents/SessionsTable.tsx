import { sessionsData } from "@/src/data/sessionsData/sessionsData";
import { SESSIONS_TABLE_GRID } from "@/src/sections/sessionsSections/sessionsTableGrid";
import SessionTableRow from "@/src/sections/sessionsSections/SessionTableRow";

const COLUMNS = ["Date", "Time", "Client", "Therapist", "Type", "Status"];

export default function SessionsTable() {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${SESSIONS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column) => (
          <div
            key={column}
            className="px-2 py-2.5 text-sm font-semibold leading-5 text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {sessionsData.map((session) => (
          <SessionTableRow key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
