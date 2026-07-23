import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";
import StatCard from "@/src/sections/dashboardSections/StatCard";

export default function LeadClientStatsRow({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
