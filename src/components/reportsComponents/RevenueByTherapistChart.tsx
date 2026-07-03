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
import { revenueByTherapistData } from "@/src/data/reportsData/revenueByTherapistData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 10 };

export default function RevenueByTherapistChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div className="h-[460px]">
      <ChartCard title="Revenue by Therapist" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByTherapistData}
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
                  domain={[0, 1400]}
                  ticks={[0, 350, 700, 1050, 1400]}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <Tooltip />
                {/* Same per-bar stagger fallback note as the other charts. */}
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
