"use client";

import { useEffect, useState } from "react";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import ExportButtons from "@/src/sections/reportsSections/ExportButtons";
import ConversionStageBar from "@/src/sections/reportsSections/ConversionStageBar";
import { reportsService, type ReportFilters, type ConversionReport } from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";
import { ChartSkeleton } from "@/src/components/ui/ChartSkeleton";

const EMPTY: ConversionReport = { overallRate: 0, totalLeads: 0, stages: [] };

export default function LeadConversionReport({ filters }: { filters: ReportFilters }) {
  // Bar-growth animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);
  const [report, setReport] = useState<ConversionReport>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    reportsService.fetchConversion(filters).then(setReport).catch(() => {}).finally(() => setIsLoading(false));
  }, [filters]);

  if (isLoading) {
    return <ChartSkeleton title="Lead Conversion" heightClassName="h-40" />;
  }

  return (
    <ChartCard title="Lead Conversion" action={
          <ExportButtons
            path="/api/exports/reports/conversion"
            params={{ range: filters.range, location_id: filters.locationId }}
            baseName="fbt-conversion-report"
          />
        }>
      <div ref={ref} className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-[#376EF4]">
            {report.overallRate}%
          </span>
          <span className="text-sm font-normal text-[#596475]">
            overall conversion rate
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {report.stages.map((stage, index) => (
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
