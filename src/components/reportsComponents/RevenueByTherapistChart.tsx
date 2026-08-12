"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import ExportButtons from "@/src/sections/reportsSections/ExportButtons";
import {
  reportsService,
  type ReportFilters,
  type RevenueEntry,
} from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";
import { ChartSkeleton } from "@/src/components/ui/ChartSkeleton";
import ChartPager from "@/src/components/ui/ChartPager";
import { useChartPages } from "@/src/hooks/useChartPages";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 10 };

export default function RevenueByTherapistChart({ filters }: { filters: ReportFilters }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<RevenueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Y axis is scaled from the full dataset below, not from pageData —
  // a per-page axis would make bars on different pages incomparable.
  const pages = useChartPages(data);

  useEffect(() => {
    setIsLoading(true);
    reportsService.fetchRevenue(filters).then(setData).catch(() => {}).finally(() => setIsLoading(false));
  }, [filters]);

  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
  const yMax = Math.ceil(maxRevenue / 350) * 350 || 350;

  if (isLoading) {
    return (
      <div className="h-[460px]">
        <ChartSkeleton title="Revenue by Therapist" heightClassName="h-full" />
      </div>
    );
  }

  return (
    <div className="h-[460px]">
      <ChartCard title="Revenue by Therapist" action={
        <div className="flex items-center gap-3">
            <ChartPager
              rangeLabel={pages.rangeLabel}
              canPrev={pages.canPrev}
              canNext={pages.canNext}
              onPrev={pages.prev}
              onNext={pages.next}
              isPaged={pages.isPaged}
              label="therapists"
            />
            <ExportButtons
              path="/api/exports/reports/revenue"
              params={{ range: filters.range, location_id: filters.locationId }}
              formats={["csv"]}
              baseName="fbt-revenue-report"
            />
        </div>
        }>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pages.pageData}
                margin={{ top: 8, right: 8, left: -8, bottom: 8 }}
              >
                <CartesianGrid
                  stroke="#E0E5EB"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                  angle={-45}
                  textAnchor="end"
                  height={56}
                  interval={0}
                />
                <YAxis
                  domain={[0, yMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  fill="#376EF4"
                  barSize={18}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  animationDuration={1100}
                  animationEasing="ease-out"
                  animationBegin={0}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
