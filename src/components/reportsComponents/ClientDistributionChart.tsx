"use client";

import { useEffect, useState } from "react";
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
import {
  reportsService,
  type ReportFilters,
  type ClientDistributionSlice,
} from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

export default function ClientDistributionChart({ filters }: { filters: ReportFilters }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<ClientDistributionSlice[]>([]);

  useEffect(() => {
    reportsService.fetchClientDistribution(filters).then(setData).catch(() => {});
  }, [filters]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const xMax = Math.ceil(maxCount / 3) * 3 || 3;

  return (
    <div className="h-[460px]">
      <ChartCard title="Client Distribution by Status" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
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
                  domain={[0, xMax]}
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
