"use client";

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
import { teamPerformanceData } from "@/src/data/reportsData/teamPerformanceData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 10 };

export default function TeamPerformanceChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div className="h-[460px]">
      <ChartCard title="Team Performance" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teamPerformanceData}
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
                  domain={[0, 600]}
                  ticks={[0, 150, 300, 450, 600]}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <Tooltip />
                {/* Same per-bar stagger fallback note as the other charts. */}
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
