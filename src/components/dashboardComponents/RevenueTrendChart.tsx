"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import { revenueTrendData } from "@/src/data/dashboardData/revenueTrendData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 12 };

export default function RevenueTrendChart() {
  // Chart animation only starts once the card scrolls into view, rather
  // than firing on page load where it'd finish before anyone sees it.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard
      title="Revenue Trend"
      subtitle="Collected vs pending — last 6 months"
    >
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrendData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueCollectedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#376EF4" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#376EF4" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="revenuePendingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F2A618" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#F2A618" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#E0E5EB"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <YAxis
                domain={[0, 3200]}
                ticks={[0, 800, 1600, 2400, 3200]}
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="pending"
                stroke="#F2A618"
                strokeWidth={2}
                fill="url(#revenuePendingGradient)"
                isAnimationActive
                animationDuration={2000}
                animationEasing="ease-out"
                animationBegin={0}
              />
              <Area
                type="monotone"
                dataKey="collected"
                stroke="#376EF4"
                strokeWidth={2}
                fill="url(#revenueCollectedGradient)"
                isAnimationActive
                animationDuration={2000}
                animationEasing="ease-out"
                animationBegin={150}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
