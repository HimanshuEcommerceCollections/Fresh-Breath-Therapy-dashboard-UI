// ProfileCardSkeleton — matches TherapistCard.tsx's shape exactly: avatar
// circle + name/subtitle lines, a 3-stat row (Active/YTD/Revenue), and a
// PTO balance line.

import { Skeleton } from "@/src/components/ui/Skeleton";

export function ProfileCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-start gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <div className="flex justify-between">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-2.5 w-10" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

export function ProfileCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProfileCardSkeleton key={i} />
      ))}
    </div>
  );
}
