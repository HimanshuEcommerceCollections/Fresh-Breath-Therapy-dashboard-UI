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
import type { RevenueBarPoint } from "@/src/data/paymentsData/revenueTrendBarData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 12 };

function RevenueTrendBarChart({ data }: { data: RevenueBarPoint[] }) {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();
  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
  const yMax = Math.ceil(maxRevenue / 800) * 800 || 800;

  return (
    <ChartCard title="Revenue Trend" subtitle="Monthly revenue — last 6 months">
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
                domain={[0, yMax]}
                axisLine={false}
                tickLine={false}
                tick={AXIS_TICK_STYLE}
              />
              <Tooltip />
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

function StatusDistributionChart({ data }: { data: PaymentStatusSlice[] }) {
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
                  data={data}
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
                  {data.map((slice) => (
                    <Cell key={slice.status} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {data.map((slice) => (
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

export default function PaymentsChartsRow({
  revenueTrend,
  statusDistribution,
}: {
  revenueTrend: RevenueBarPoint[];
  statusDistribution: PaymentStatusSlice[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <RevenueTrendBarChart data={revenueTrend} />
      </div>
      <div className="h-[386px]">
        <StatusDistributionChart data={statusDistribution} />
      </div>
    </div>
  );
}
