import type { PTOLeaderboardEntry } from "@/src/services/ptoService";
import { PTO_LEADERBOARD_GRID } from "@/src/sections/ptoDashboardSections/ptoLeaderboardGrid";
import LeaderboardRow from "@/src/sections/ptoDashboardSections/LeaderboardRow";

const COLUMNS: { label: string; align: "left" | "right" }[] = [
  { label: "#", align: "left" },
  { label: "Therapist", align: "left" },
  { label: "Location", align: "left" },
  { label: "YTD Sessions", align: "right" },
  { label: "PTO Accrued", align: "right" },
  { label: "PTO Used", align: "right" },
  { label: "Balance", align: "right" },
  { label: "Avg /wk", align: "right" },
];

export default function TherapistLeaderboardTable({
  leaderboard,
}: {
  leaderboard: PTOLeaderboardEntry[];
}) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col px-6 pt-5">
        <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
          Therapist Leaderboard
        </h3>
        <p className="text-xs font-normal text-[#596475]">
          Ranked by PTO balance
        </p>
      </div>

      <div className={`${PTO_LEADERBOARD_GRID} border-b border-[#E0E5EB] px-4 pt-2`}>
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className={`px-2 py-2.5 text-sm font-medium leading-5 text-[#596475] ${
              column.align === "right" ? "text-right" : ""
            }`}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div>
        {leaderboard.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))}
      </div>
    </div>
  );
}
