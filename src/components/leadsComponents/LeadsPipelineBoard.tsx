import { leadsData } from "@/src/data/leadsData/leadsData";
import { pipelineStages } from "@/src/data/leadsData/pipelineStageConfig";
import PipelineColumn from "@/src/sections/leadsSections/PipelineColumn";

export default function LeadsPipelineBoard() {
  return (
    <div className="flex min-h-140 flex-row items-stretch gap-4 overflow-x-auto">
      {pipelineStages.map((stage) => (
        <PipelineColumn
          key={stage.status}
          stage={stage}
          leads={leadsData.filter((lead) => lead.status === stage.status)}
        />
      ))}
    </div>
  );
}
