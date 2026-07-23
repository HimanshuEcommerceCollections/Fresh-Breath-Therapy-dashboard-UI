"use client";

import type { Lead } from "@/src/services/leadsService";

export default function PipelineCard({ lead }: { lead: Lead }) {
  return (
    <button
      type="button"
      onClick={() => {
        // TODO: open the lead detail view once it exists.
      }}
      className="flex cursor-pointer flex-col gap-1 rounded-xl border border-[rgba(224,229,235,0.6)] bg-white p-3 text-left transition hover:shadow-sm"
    >
      <span className="truncate text-[13px] font-semibold text-[#071123]">
        {lead.name}
      </span>
      <span className="truncate text-[11px] font-normal text-[#596475]">
        {lead.location} · {lead.source}
      </span>
    </button>
  );
}
