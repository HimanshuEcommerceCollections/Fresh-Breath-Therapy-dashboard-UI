"use client";

import type { Lead } from "@/src/services/leadsService";
import HoverNote from "@/src/components/sharedComponents/HoverNote";

export default function PipelineCard({ lead }: { lead: Lead }) {
  // A <div>, not a <button>. HoverNote renders its own focusable trigger, and
  // a button inside a button is invalid HTML — browsers drop the inner one, so
  // the note would stop being keyboard-reachable. Nothing is lost: the card's
  // onClick was an empty TODO waiting on a lead detail view. Restore it as a
  // real control (or wrap the inner content in a link) when that view exists.
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[rgba(224,229,235,0.6)] bg-white p-3 text-left transition hover:shadow-sm">
      <HoverNote note={lead.note}>
        <span className="truncate text-[13px] font-semibold text-[#071123]">
          {lead.name}
        </span>
      </HoverNote>
      <span className="truncate text-[11px] font-normal text-[#596475]">
        {lead.location} · {lead.source}
      </span>
    </div>
  );
}
