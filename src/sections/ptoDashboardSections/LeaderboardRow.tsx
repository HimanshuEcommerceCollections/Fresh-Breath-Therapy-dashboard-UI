import type { PTOLeaderboardEntry as LeaderboardEntry } from "@/src/services/ptoService";
import { PTO_LEADERBOARD_GRID } from "@/src/sections/ptoDashboardSections/ptoLeaderboardGrid";

export default function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div
      className={`${PTO_LEADERBOARD_GRID} min-h-[53px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="px-2 py-2 text-sm font-medium leading-5 text-[#596475]">
        {entry.rank}
      </div>
      <div className="flex flex-col px-2 py-2">
        <span className="truncate text-sm font-medium leading-5 text-[#071123]">
          {entry.name}
        </span>
        <span className="truncate text-xs font-normal leading-4 text-[#596475]">
          {entry.credential}
        </span>
      </div>
      <div className="truncate px-2 py-2 text-sm font-normal leading-5 text-[#071123]">
        {entry.location}
      </div>
      <div className="px-2 py-2 text-right text-sm font-normal leading-5 text-[#071123]">
        {entry.ytdSessions}
      </div>
      <div className="px-2 py-2 text-right text-sm font-normal leading-5 text-[#071123]">
        {entry.ptoAccrued}h
      </div>
      <div className="px-2 py-2 text-right text-sm font-normal leading-5 text-[#071123]">
        {entry.ptoUsed}h
      </div>
      <div className="px-2 py-2 text-right text-sm font-semibold leading-5 text-[#376EF4]">
        {entry.balance}h
      </div>
      <div className="px-2 py-2 text-right text-sm font-normal leading-5 text-[#071123]">
        {entry.avgPerWeek}
      </div>
    </div>
  );
}
