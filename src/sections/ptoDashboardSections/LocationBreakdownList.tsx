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
    <ChartCard
      title="Location Breakdown"
      // The count belongs in the header once the list scrolls: otherwise there
      // is no way to tell a 9-location clinic from a 47-location one without
      // dragging to the bottom.
      subtitle={isLoading ? undefined : `${items.length} location${items.length === 1 ? "" : "s"}`}
    >
      {/* min-h-0 is what actually makes this scroll. The parent is a flex
          column with a fixed height, and a flex child's default min-height is
          auto — so without it the child grows to fit all 47 rows and pushes
          past the card instead of scrolling inside it, which is what was
          happening before. */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
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
                  className="flex items-center justify-between gap-3 py-2"
                >
                  {/* min-w-0 + truncate so a long location name shortens
                      rather than shoving the figures off the card. */}
                  <span
                    className="min-w-0 truncate text-sm font-medium text-[#071123]"
                    title={item.location}
                  >
                    {item.location}
                  </span>
                  <span className="shrink-0 text-sm font-normal tabular-nums text-[#596475]">
                    {item.therapistCount} · {item.sessions} sess · {item.ptoHours}h
                  </span>
                </div>
              ))}
        </div>
      </div>
    </ChartCard>
  );
}
