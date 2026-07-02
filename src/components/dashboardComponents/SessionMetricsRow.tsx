import { sessionMetricsStats } from "@/src/data/dashboardData/sessionMetricsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";
import SectionLabel from "@/src/sections/dashboardSections/SectionLabel";

export default function SessionMetricsRow() {
  return (
    <div>
      <SectionLabel label="Session Metrics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {sessionMetricsStats.map((card) => (
          <StatCard key={card.label} {...card} compact />
        ))}
      </div>
    </div>
  );
}
