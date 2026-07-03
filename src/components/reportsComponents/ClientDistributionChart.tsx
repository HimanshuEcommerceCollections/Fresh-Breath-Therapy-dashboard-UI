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
import { clientDistributionData } from "@/src/data/reportsData/clientDistributionData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

export default function ClientDistributionChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div className="h-[460px]">
      <ChartCard title="Client Distribution by Status" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clientDistributionData}
                layout="vertical"
                margin={{ top: 8, right: 8, left: 48, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#E0E5EB"
                  strokeDasharray="4 4"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, 12]}
                  ticks={[0, 3, 6, 9, 12]}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <YAxis
                  type="category"
                  dataKey="status"
                  width={110}
                  axisLine={false}
                  tickLine={false}
                  tick={AXIS_TICK_STYLE}
                />
                <Tooltip />
                {/* Recharts doesn't support per-bar animationBegin staggering,
                    so all bars grow together — same fallback as the app's
                    other bar charts. */}
                <Bar
                  dataKey="count"
                  fill="#376EF4"
                  barSize={22}
                  radius={[0, 4, 4, 0]}
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
