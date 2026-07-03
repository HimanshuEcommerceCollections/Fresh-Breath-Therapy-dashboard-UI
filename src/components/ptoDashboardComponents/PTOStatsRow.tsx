import { ptoStatsData } from "@/src/data/ptoDashboardData/ptoStatsData";
import StatCard from "@/src/sections/dashboardSections/StatCard";

export default function PTOStatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {ptoStatsData.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          iconSrc={stat.iconSrc}
          iconBgColor={stat.iconBg}
          iconColor={stat.iconColor}
          compact
        />
      ))}
    </div>
  );
}
