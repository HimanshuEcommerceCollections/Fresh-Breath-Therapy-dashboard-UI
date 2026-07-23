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
import CsvButton from "@/src/sections/reportsSections/CsvButton";
import {
  reportsService,
  type ReportFilters,
  type TeamPerformanceEntry,
} from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 10 };

export default function TeamPerformanceChart({ filters }: { filters: ReportFilters }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<TeamPerformanceEntry[]>([]);

  useEffect(() => {
    reportsService.fetchTeamPerformance(filters).then(setData).catch(() => {});
  }, [filters]);

  const maxSessions = Math.max(1, ...data.map((d) => d.sessions));
  const yMax = Math.ceil(maxSessions / 150) * 150 || 150;

  return (
    <div className="h-[460px]">
      <ChartCard title="Team Performance" action={<CsvButton />}>
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
                  dataKey="sessions"
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
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden className="h-2 w-2 shrink-0 bg-[#376EF4]" />
          <span className="text-xs font-normal text-[#596475]">sessions</span>
        </div>
      </ChartCard>
    </div>
  );
}
