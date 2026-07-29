import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import { paymentsStatIcons } from "@/src/data/paymentsData/paymentsStatsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";
import { SummaryCardSkeleton } from "@/src/components/ui/SummaryCardSkeleton";

export default function PaymentsStatsRow({
  stats,
  isLoading,
}: {
  stats: PaymentStat[];
  isLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <SummaryCardSkeleton key={i} />)
        : stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              iconSrc={paymentsStatIcons[index]}
              iconBgColor={stat.iconBg}
              iconColor={stat.iconColor}
              compact
            />
          ))}
    </div>
  );
}
