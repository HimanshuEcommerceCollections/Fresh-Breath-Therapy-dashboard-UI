import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";
import StatCard from "@/src/sections/dashboardSections/StatCard";
import SectionLabel from "@/src/sections/dashboardSections/SectionLabel";
import { SummaryCardSkeleton } from "@/src/components/ui/SummaryCardSkeleton";

export default function SessionMetricsRow({
  stats,
  isLoading,
}: {
  stats: StatCardData[];
  isLoading: boolean;
}) {
  return (
    <div>
      <SectionLabel label="Session Metrics" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <SummaryCardSkeleton key={i} />)
          : stats.map((card) => <StatCard key={card.label} {...card} compact />)}
      </div>
    </div>
  );
}
