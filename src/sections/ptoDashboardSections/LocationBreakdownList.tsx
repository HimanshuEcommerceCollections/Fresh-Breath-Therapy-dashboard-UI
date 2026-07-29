import ChartCard from "@/src/sections/dashboardSections/ChartCard";
import { Skeleton } from "@/src/components/ui/Skeleton";
import type { PTOLocationBreakdown } from "@/src/services/ptoService";

export default function LocationBreakdownList({
  items,
  isLoading,
}: {
  items: PTOLocationBreakdown[];
  isLoading: boolean;
}) {
  return (
    <ChartCard title="Location Breakdown">
      <div className="flex flex-col divide-y divide-[rgba(224,229,235,0.6)]">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))
          : items.map((item) => (
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
