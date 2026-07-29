// SummaryCardSkeleton — matches StatCard.tsx's exact shape: a label-width
// line + a big-number-width line on the left, an icon-circle placeholder
// on the right, same card chrome (radius/border/shadow/padding).

import { Skeleton } from "@/src/components/ui/Skeleton";

export function SummaryCardSkeleton() {
  return (
    <div className="flex flex-row items-start justify-between rounded-[18px] border border-[rgba(224,229,235,0.6)] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
      <Skeleton className="h-10 w-10 shrink-0 rounded-[18px]" />
    </div>
  );
}
