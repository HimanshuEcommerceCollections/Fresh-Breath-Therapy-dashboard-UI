"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import { revenueTrendBarData } from "@/src/data/paymentsData/revenueTrendBarData";
import { statusDistributionData } from "@/src/data/paymentsData/statusDistributionData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 12 };

function RevenueTrendBarChart() {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard title="Revenue Trend" subtitle="Monthly revenue — last 6 months">
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueTrendBarData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
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
              {/* Recharts doesn't support per-bar animationBegin staggering,
                  so all bars grow bottom-to-top together — same fallback as
                  the Lead Conversion Funnel's left-to-right growth. */}
              <Bar
                dataKey="revenue"
                fill="#376EF4"
                barSize={40}
                radius={[4, 4, 0, 0]}
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

function StatusDistributionChart() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard
      title="Status Distribution"
      subtitle="Distribution across all invoices"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <div ref={ref} className="min-h-0 w-full flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={1300}
                  animationEasing="ease-out"
                >
                  {statusDistributionData.map((slice) => (
                    <Cell key={slice.status} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {statusDistributionData.map((slice) => (
            <div key={slice.status} className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: slice.color }}
              >
                {slice.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export default function PaymentsChartsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <RevenueTrendBarChart />
      </div>
      <div className="h-[386px]">
        <StatusDistributionChart />
      </div>
    </div>
  );
}
