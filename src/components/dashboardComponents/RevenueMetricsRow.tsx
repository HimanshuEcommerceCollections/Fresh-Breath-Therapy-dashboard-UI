import { revenueMetricsStats } from "@/src/data/dashboardData/revenueMetricsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";
import SectionLabel from "@/src/sections/dashboardSections/SectionLabel";

export default function RevenueMetricsRow() {
  return (
    <div>
      <SectionLabel label="Revenue Metrics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {revenueMetricsStats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
