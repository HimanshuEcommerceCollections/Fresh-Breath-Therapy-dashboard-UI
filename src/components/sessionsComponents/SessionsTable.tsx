import type { Session } from "@/src/services/sessionsService";
import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import { SESSIONS_TABLE_GRID } from "@/src/sections/sessionsSections/sessionsTableGrid";
import SessionTableRow from "@/src/sections/sessionsSections/SessionTableRow";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";

const COLUMNS = ["Date", "Time", "Client", "Therapist", "Type", "Status"];

export default function SessionsTable({
  sessions,
  isLoading,
  onStatusChange,
}: {
  sessions: Session[];
  isLoading: boolean;
  onStatusChange: (sessionId: string, status: SessionStatus) => Promise<void>;
}) {
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
        {isLoading ? (
          <TableSkeleton gridClassName={SESSIONS_TABLE_GRID} columns={COLUMNS.length} />
        ) : sessions.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#94A3B8]">
            No sessions found.
          </div>
        ) : (
          sessions.map((session) => (
            <SessionTableRow
              key={session.id}
              session={session}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
