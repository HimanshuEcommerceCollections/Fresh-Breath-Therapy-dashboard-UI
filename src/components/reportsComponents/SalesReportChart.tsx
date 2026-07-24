"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import CsvButton from "@/src/sections/reportsSections/CsvButton";
import { reportsService, type ReportFilters, type SalesReportPoint } from "@/src/services/reportsService";
import { useInView } from "@/src/hooks/useInView";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 12 };

export default function SalesReportChart({ filters }: { filters: ReportFilters }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const [data, setData] = useState<SalesReportPoint[]>([]);

  useEffect(() => {
    reportsService.fetchSales(filters).then(setData).catch(() => {});
  }, [filters]);

  const maxSales = Math.max(1, ...data.map((d) => d.sales));
  const yMax = Math.ceil(maxSales / 800) * 800 || 800;

  return (
    <div className="h-[386px]">
      <ChartCard title="Sales Report" action={<CsvButton />}>
        <div ref={ref} className="min-h-0 flex-1">
          {isInView && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
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
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#376EF4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
