import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";
import StatCard from "@/src/sections/dashboardSections/StatCard";
import SectionLabel from "@/src/sections/dashboardSections/SectionLabel";

export default function RevenueMetricsRow({ stats }: { stats: StatCardData[] }) {
  return (
    <div>
      <SectionLabel label="Revenue Metrics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
