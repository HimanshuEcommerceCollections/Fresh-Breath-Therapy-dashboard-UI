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
import { ChartSkeleton } from "@/src/components/ui/ChartSkeleton";
import ChartPager from "@/src/components/ui/ChartPager";
import LocationBreakdownList from "@/src/sections/ptoDashboardSections/LocationBreakdownList";
import type { PTOLocationBreakdown } from "@/src/services/ptoService";
import { useInView } from "@/src/hooks/useInView";
import { useChartPages } from "@/src/hooks/useChartPages";

const AXIS_TICK_STYLE = { fill: "#596475", fontSize: 11 };

function PTOByLocationChart({
  data,
  isLoading,
}: {
  data: PTOLocationBreakdown[];
  isLoading: boolean;
}) {
  // Chart animation only starts once the card scrolls into view.
  const { ref, isInView } = useInView<HTMLDivElement>();
  const pages = useChartPages(data);

  // Y axis scaled to the WHOLE dataset, not the visible page. Rescaling per
  // page would redraw the axis on every click and make bars from different
  // pages visually incomparable — a 2h bar could look taller than a 12h one.
  const maxHours = Math.max(1, ...data.map((d) => d.ptoHours));
  const yMax = Math.ceil(maxHours / 15) * 15 || 15;

  if (isLoading) {
    return (
      <ChartSkeleton
        title="PTO Accrued by Location"
        subtitle="Driven by completed sessions × 0.04"
        heightClassName="h-full"
      />
    );
  }

  return (
    <ChartCard
      title="PTO Accrued by Location"
      subtitle="Driven by completed sessions × 0.04"
      action={
        <ChartPager
          rangeLabel={pages.rangeLabel}
          canPrev={pages.canPrev}
          canNext={pages.canNext}
          onPrev={pages.prev}
          onNext={pages.next}
          isPaged={pages.isPaged}
          label="locations"
        />
      }
    >
      <div ref={ref} className="min-h-0 flex-1">
        {isInView && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pages.pageData}
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
                angle={-20}
                textAnchor="end"
                height={64}
                // Six per page leaves real room, but FBT has location names
                // like "Oakwood North Judithbury Clinic 1" that overrun it
                // anyway. Truncated here rather than left to overlap; the
                // tooltip carries the full name on hover.
                tickFormatter={(name: string) =>
                  name.length > 18 ? `${name.slice(0, 17)}…` : name
                }
              />
              <YAxis
                domain={[0, yMax]}
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

export default function PTOChartsRow({
  byLocation,
  isLoading,
}: {
  byLocation: PTOLocationBreakdown[];
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="h-[386px]">
        <PTOByLocationChart data={byLocation} isLoading={isLoading} />
      </div>
      <div className="h-[386px]">
        <LocationBreakdownList items={byLocation} isLoading={isLoading} />
      </div>
    </div>
  );
}
