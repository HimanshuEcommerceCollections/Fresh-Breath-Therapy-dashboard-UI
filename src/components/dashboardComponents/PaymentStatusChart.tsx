"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";
import { useInView } from "@/src/hooks/useInView";

export default function PaymentStatusChart({ data }: { data: PaymentStatusSlice[] }) {
  // Chart animation only starts once the card scrolls into view, rather
  // than firing on page load where it'd finish before anyone sees it.
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <ChartCard
      title="Payment Status"
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
                  animationDuration={1400}
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
