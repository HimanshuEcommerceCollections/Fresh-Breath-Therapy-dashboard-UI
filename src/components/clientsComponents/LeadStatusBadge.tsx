import type { LeadStatus } from "@/src/data/leadsData/leadsData";
import { leadStatusBadgeColors } from "@/src/data/leadsData/leadStatusBadgeColors";

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const colors = leadStatusBadgeColors[status];

  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {colors.label}
    </span>
  );
}
