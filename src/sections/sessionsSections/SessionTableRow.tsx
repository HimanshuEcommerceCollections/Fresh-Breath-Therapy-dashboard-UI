"use client";

import type { SessionRow } from "@/src/data/sessionsData/sessionsData";
import { statusOptionsData } from "@/src/data/sessionsData/statusOptionsData";
import { SESSIONS_TABLE_GRID } from "@/src/sections/sessionsSections/sessionsTableGrid";
import StatusCombobox from "@/src/sections/leadsSections/StatusCombobox";

export default function SessionTableRow({ session }: { session: SessionRow }) {
  return (
    <div
      className={`${SESSIONS_TABLE_GRID} border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="px-2 py-3.5 text-sm font-normal leading-5 text-[#071123]">
        {session.date}
      </div>
      <div className="px-2 py-3.5 text-sm font-normal leading-5 text-[#071123]">
        {session.time}
      </div>
      <div className="truncate px-2 py-3.5 text-sm font-normal leading-5 text-[#071123]">
        {session.client}
      </div>
      <div className="truncate px-2 py-3.5 text-sm font-normal leading-5 text-[#071123]">
        {session.therapist}
      </div>
      <div className="truncate px-2 py-3.5 text-sm font-normal leading-5 text-[#071123]">
        {session.type}
      </div>
      <div className="px-2 py-2">
        <StatusCombobox status={session.status} options={statusOptionsData} />
      </div>
    </div>
  );
}
