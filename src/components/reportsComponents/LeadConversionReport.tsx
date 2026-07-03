"use client";

import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import CsvButton from "@/src/sections/reportsSections/CsvButton";
import ConversionStageBar from "@/src/sections/reportsSections/ConversionStageBar";
import {
  leadConversionReportData,
  overallConversionRate,
} from "@/src/data/reportsData/leadConversionReportData";
import { useInView } from "@/src/hooks/useInView";

export default function LeadConversionReport() {
  // Bar-growth animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);

  return (
    <ChartCard title="Lead Conversion" action={<CsvButton />}>
      <div ref={ref} className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#376EF4]">
            {overallConversionRate}%
          </span>
          <span className="text-sm font-normal text-[#596475]">
            overall conversion rate
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {leadConversionReportData.map((stage, index) => (
            <ConversionStageBar
              key={stage.stage}
              stage={stage}
              animate={isInView}
              index={index}
            />
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
