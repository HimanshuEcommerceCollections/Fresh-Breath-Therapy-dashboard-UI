import { Skeleton } from "@/src/components/ui/Skeleton";

// Matches ToggleRow.tsx's shape: a label line + a 36×20 pill placeholder.
export function ToggleRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-5 w-9 rounded-full" />
    </div>
  );
}
