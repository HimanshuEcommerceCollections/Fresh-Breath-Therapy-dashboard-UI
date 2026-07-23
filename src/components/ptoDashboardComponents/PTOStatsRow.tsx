import type { PTOStats } from "@/src/services/ptoService";
import StatCard from "@/src/sections/dashboardSections/StatCard";

const ICON_BASE = "/ptodashboard";
const BLUE = { iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)" };
const GREEN = { iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" };
const ORANGE = { iconColor: "#F2A618", iconBg: "rgba(242,166,24,0.1)" };

export default function PTOStatsRow({ stats }: { stats: PTOStats }) {
  const cards = [
    { label: "Total Therapists", value: String(stats.totalTherapists), iconSrc: `${ICON_BASE}/totaltherapist.svg`, ...BLUE },
    { label: "Total Sessions", value: stats.totalSessions.toLocaleString(), iconSrc: `${ICON_BASE}/totalsessions.svg`, ...BLUE },
    { label: "PTO Accrued", value: `${stats.ptoAccrued}h`, iconSrc: `${ICON_BASE}/ptoaccrued.svg`, ...GREEN },
    { label: "PTO Used", value: `${stats.ptoUsed}h`, iconSrc: `${ICON_BASE}/ptoused.svg`, ...ORANGE },
    { label: "PTO Balance", value: `${stats.ptoBalance}h`, iconSrc: `${ICON_BASE}/ptobalance.svg`, ...BLUE },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((stat) => (
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
