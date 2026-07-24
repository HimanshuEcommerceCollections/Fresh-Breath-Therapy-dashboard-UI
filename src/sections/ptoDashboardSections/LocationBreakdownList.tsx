import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import type { PTOLocationBreakdown } from "@/src/services/ptoService";

export default function LocationBreakdownList({ items }: { items: PTOLocationBreakdown[] }) {
  return (
    <ChartCard title="Location Breakdown">
      <div className="flex flex-col divide-y divide-[rgba(224,229,235,0.6)]">
        {items.map((item) => (
          <div
            key={item.locationId}
            className="flex items-center justify-between py-2"
          >
            <span className="text-sm font-medium text-[#071123]">
              {item.location}
            </span>
            <span className="text-sm font-normal text-[#596475]">
              {item.therapistCount} · {item.sessions} sess · {item.ptoHours}h
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
