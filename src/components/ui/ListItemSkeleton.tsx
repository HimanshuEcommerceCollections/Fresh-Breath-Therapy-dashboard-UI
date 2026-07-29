// ListItemSkeleton — for Notifications and Signup Requests list rows.
// Mirrors one item's shape: icon circle + title line + subtitle line on
// the left, a button-shaped placeholder on the right.

import { Skeleton } from "@/src/components/ui/Skeleton";

export function ListItemSkeleton({ isLast = false }: { isLast?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-6 py-4 ${
        !isLast ? "border-b border-[#F1F5F9]" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <ListItemSkeleton key={i} isLast={i === rows - 1} />
      ))}
    </>
  );
}
