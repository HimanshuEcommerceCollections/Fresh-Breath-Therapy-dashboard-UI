import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import { paymentsStatIcons } from "@/src/data/paymentsData/paymentsStatsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";

export default function PaymentsStatsRow({ stats }: { stats: PaymentStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
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
