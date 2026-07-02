"use client";

import type { FollowUp } from "@/src/data/followUpsData/followUpsData";
import { FOLLOW_UPS_TABLE_GRID } from "@/src/sections/followUpsSections/followUpsTableGrid";
import StatusPill from "@/src/sections/followUpsSections/StatusPill";

export default function FollowUpTableRow({ followUp }: { followUp: FollowUp }) {
  return (
    <div
      className={`${FOLLOW_UPS_TABLE_GRID} min-h-[50px] border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="truncate px-2 py-3 text-sm font-medium leading-5 tracking-[-0.154px] text-[#071123]">
        {followUp.client}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        {followUp.dueDate}
      </div>
      <div className="truncate px-2 py-3 text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
        {followUp.notes}
      </div>
      <div className="px-2 py-3 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        {followUp.reminder ? "On" : "Off"}
      </div>
      <div className="px-2 py-3">
        <StatusPill status={followUp.status} />
      </div>
      <div className="flex justify-end px-2 py-2">
        {followUp.status !== "Completed" && (
          <button
            type="button"
            onClick={() => {
              // TODO: mark the follow-up done once followUpsData is stateful.
            }}
            className="h-8 cursor-pointer rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-3 text-xs font-medium leading-4 text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
          >
            Mark done
          </button>
        )}
      </div>
    </div>
  );
}
