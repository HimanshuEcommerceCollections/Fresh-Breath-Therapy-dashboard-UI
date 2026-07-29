// ChartSkeleton — for Revenue Trend, Payment Status, and any other chart
// inside ChartCard.tsx. Mirrors the card chrome and swaps the chart body
// for a shimmering rectangle at a realistic chart aspect ratio, rather
// than a blank div, so the card's overall shape never shifts on load.

import { Skeleton } from "@/src/components/ui/Skeleton";

export function ChartSkeleton({
  title,
  subtitle,
  heightClassName = "h-64",
}: {
  title?: string;
  subtitle?: string;
  heightClassName?: string;
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-1.5">
        {title ? (
          <h3 className="text-base font-semibold tracking-[-0.32px] text-[#071123]">
            {title}
          </h3>
        ) : (
          <Skeleton className="h-4 w-32" />
        )}
        {subtitle ? (
          <p className="text-xs font-normal text-[#596475]">{subtitle}</p>
        ) : (
          <Skeleton className="h-3 w-48" />
        )}
      </div>
      <Skeleton className={`w-full ${heightClassName}`} />
    </div>
  );
}
