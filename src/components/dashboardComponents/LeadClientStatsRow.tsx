import { leadClientStats } from "@/src/data/dashboardData/leadClientStatsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";

export default function LeadClientStatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {leadClientStats.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
