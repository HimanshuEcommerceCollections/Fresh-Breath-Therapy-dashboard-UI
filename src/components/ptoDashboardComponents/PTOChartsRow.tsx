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
import LocationBreakdownList from "@/src/sections/ptoDashboardSections/LocationBreakdownList";
import { ptoByLocationData } from "@/src/data/ptoDashboardData/ptoByLocationData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

function PTOByLocationChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard
      title="PTO Accrued by Location"
      subtitle="Driven by completed sessions × 0.04"
    >
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ptoByLocationData}
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
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <Tooltip />
              {/* Recharts doesn't support per-bar animationBegin staggering,
                  so all bars grow bottom-to-top together — same fallback as
                  the funnel/Payments bar charts. */}
              <Bar
                dataKey="ptoHours"
                fill="#376EF4"
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
  );
}

export default function PTOChartsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <PTOByLocationChart />
      </div>
      <div className="h-[386px]">
        <LocationBreakdownList />
      </div>
    </div>
  );
}
