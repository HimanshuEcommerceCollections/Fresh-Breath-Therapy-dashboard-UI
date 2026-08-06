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
  type UtilizationEntry,
} from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";
import { ChartSkeleton } from "@/src/components/ui/ChartSkeleton";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 10 };

export default function TherapistUtilizationChart({ filters }: { filters: ReportFilters }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<UtilizationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    reportsService.fetchUtilization(filters).then(setData).catch(() => {}).finally(() => setIsLoading(false));
  }, [filters]);

  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const yMax = Math.ceil(maxValue / 3) * 3 || 3;

  if (isLoading) {
    return (
      <div className="h-[460px]">
        <ChartSkeleton title="Therapist Utilization" heightClassName="h-full" />
      </div>
    );
  }

  return (
    <div className="h-[460px]">
      <ChartCard title="Therapist Utilization" action={
          <ExportButtons
            path="/api/exports/reports/utilization"
            params={{ range: filters.range, location_id: filters.locationId }}
            formats={["csv"]}
            baseName="fbt-utilization-report"
          />
        }>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: -16, bottom: 8 }}
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
                  dataKey="value"
                  fill="#3FC168"
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
