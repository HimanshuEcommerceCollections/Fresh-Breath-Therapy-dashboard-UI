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
import { retentionByLocationData } from "@/src/data/reportsData/retentionByLocationData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

export default function RetentionByLocationChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div className="h-[386px]">
      <ChartCard title="Retention by Location" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={retentionByLocationData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#E0E5EB"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="location"
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                  interval={0}
                />
                <YAxis
                  domain={[0, 24]}
                  ticks={[0, 6, 12, 18, 24]}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <Tooltip />
                {/* Zero-month locations (Raleigh, Fayetteville, Wilmington)
                    intentionally render no bar, per the reference. Same
                    per-bar stagger fallback note as the other charts. */}
                <Bar
                  dataKey="months"
                  fill="#3FC168"
                  barSize={40}
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
