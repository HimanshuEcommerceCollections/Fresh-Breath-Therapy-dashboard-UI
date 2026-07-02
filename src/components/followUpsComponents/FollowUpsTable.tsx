import { followUpsData } from "@/src/data/followUpsData/followUpsData";
import { FOLLOW_UPS_TABLE_GRID } from "@/src/sections/followUpsSections/followUpsTableGrid";
import type { FollowUpFilter } from "@/src/sections/followUpsSections/FilterTabs";
import FollowUpTableRow from "@/src/sections/followUpsSections/FollowUpTableRow";

const COLUMNS = ["Client", "Due Date", "Notes", "Reminder", "Status", ""];

export default function FollowUpsTable({
  activeTab,
}: {
  activeTab: FollowUpFilter;
}) {
  const rows =
    activeTab === "All"
      ? followUpsData
      : followUpsData.filter((f) => f.status === activeTab);

  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${FOLLOW_UPS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column, index) => (
          <div
            key={column || `col-${index}`}
            className="px-2 py-2.5 text-sm font-medium leading-5 tracking-[-0.154px] text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {rows.map((followUp) => (
          <FollowUpTableRow key={followUp.id} followUp={followUp} />
        ))}
      </div>
    </div>
  );
}
