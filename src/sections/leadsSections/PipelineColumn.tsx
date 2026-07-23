import type { Lead } from "@/src/services/leadsService";
import type { PipelineStageConfig } from "@/src/data/leadsData/pipelineStageConfig";
import PipelineCard from "@/src/sections/leadsSections/PipelineCard";

export default function PipelineColumn({
  stage,
  leads,
}: {
  stage: PipelineStageConfig;
  leads: Lead[];
}) {
  return (
    <div className="flex min-w-70 flex-1 flex-col gap-2 rounded-[18px] border border-[#E0E5EB] bg-[rgba(239,244,250,0.3)] p-4">
      <span
        className="self-start rounded-full border px-2.5 py-1 text-[11px] font-semibold"
        style={{
          backgroundColor: stage.badgeBg,
          borderColor: stage.badgeBorder,
          color: stage.badgeText,
        }}
      >
        {stage.label} · {leads.length}
      </span>

      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <PipelineCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
