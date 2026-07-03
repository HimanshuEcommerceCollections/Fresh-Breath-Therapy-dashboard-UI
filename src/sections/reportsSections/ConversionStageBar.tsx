"use client";

import type { ConversionStage } from "@/src/data/reportsData/leadConversionReportData";

export default function ConversionStageBar({
  stage,
  animate,
  index,
}: {
  stage: ConversionStage;
  // Bars sit at 0% until the card scrolls into view, then grow left-to-right
  // staggered per row — same motion language as the app's other progress bars.
  animate: boolean;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium leading-5 text-[#071123]">
          {stage.stage}
        </span>
        <span className="text-sm font-medium leading-5 text-[#071123]">
          {stage.count} ({stage.percent}%)
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#EFF4FA]">
        <div
          className="h-2 rounded-full bg-[#376EF4] transition-[width] duration-1000 ease-out"
          style={{
            width: animate ? `${stage.percent}%` : "0%",
            transitionDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  );
}
