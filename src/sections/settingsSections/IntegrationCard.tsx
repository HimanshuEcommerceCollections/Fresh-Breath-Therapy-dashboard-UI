"use client";

import type { Integration } from "@/src/data/settingsData/integrationsData";

const STATUS_BADGE_STYLES = {
  Connected: { backgroundColor: "rgba(63,193,104,0.15)", color: "#3FC168" },
  Available: { backgroundColor: "#EFF4FA", color: "#596475" },
} as const;

export default function IntegrationCard({
  integration,
}: {
  integration: Integration;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-[4px] border border-[rgba(224,229,235,0.6)] p-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-[15px] font-semibold text-[#071123]">
          {integration.name}
        </span>
        <span
          className="rounded-[4px] px-2 py-1 text-[9px] font-semibold uppercase"
          style={STATUS_BADGE_STYLES[integration.status]}
        >
          {integration.status}
        </span>
      </div>
      <p className="text-[11px] font-normal text-[#596475]">
        {integration.description}
      </p>
      <button
        type="button"
        onClick={() => {
          // TODO: real connect/configure flow is a follow-up task.
        }}
        className="h-8 cursor-pointer rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-3 text-[11px] font-semibold text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
      >
        {integration.actionLabel}
      </button>
    </div>
  );
}
