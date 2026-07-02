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
import { leadConversionFunnelData } from "@/src/data/dashboardData/leadConversionFunnelData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

export default function LeadConversionFunnelChart() {
  // Chart animation only starts once the card scrolls into view, rather
  // than firing on page load where it'd finish before anyone sees it.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard
      title="Lead Conversion Funnel"
      subtitle="Pipeline distribution by stage"
    >
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leadConversionFunnelData}
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
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <YAxis
                type="category"
                dataKey="stage"
                width={100}
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#376EF4"
                barSize={26}
                radius={[0, 4, 4, 0]}
                isAnimationActive
                animationDuration={1000}
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
