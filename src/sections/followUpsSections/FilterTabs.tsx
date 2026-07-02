"use client";

import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";

export type FollowUpFilter = FollowUpStatus | "All";

const TABS: FollowUpFilter[] = ["All", "Pending", "Overdue", "Completed"];

// Same segmented-control pattern as the Sessions ViewToggle.
export default function FilterTabs({
  activeTab,
  onChange,
}: {
  activeTab: FollowUpFilter;
  onChange: (tab: FollowUpFilter) => void;
}) {
  return (
    <div className="flex h-9 items-center self-start rounded-[14px] bg-[#EFF4FA] p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`h-7 cursor-pointer rounded-xl px-4 text-sm font-medium leading-5 tracking-[-0.154px] transition-colors ${
            activeTab === tab
              ? "bg-[#F7FBFD] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
              : "text-[#596475]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
