// TableRowSkeleton — for Leads, Clients, Payments, Sessions, Follow-Ups
// list views. Reuses the exact same grid-template className each real
// table row uses (from e.g. leadsTableGrid.ts) so skeleton columns line up
// pixel-for-pixel with the real columns that replace them, then repeats
// for a realistic table height.

import { Skeleton } from "@/src/components/ui/Skeleton";

export function TableRowSkeleton({
  gridClassName,
  columns,
  isLast = false,
}: {
  /** The real table's grid-template className, e.g. leadsTableGridClass. */
  gridClassName: string;
  /** Number of columns to render a shimmer bar for. */
  columns: number;
  isLast?: boolean;
}) {
  return (
    <div
      className={`${gridClassName} gap-4 px-6 py-4 ${
        !isLast ? "border-b border-[#F1F5F9]" : ""
      }`}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-3/4" />
      ))}
    </div>
  );
}

export function TableSkeleton({
  gridClassName,
  columns,
  rows = 7,
}: {
  gridClassName: string;
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton
          key={i}
          gridClassName={gridClassName}
          columns={columns}
          isLast={i === rows - 1}
        />
      ))}
    </>
  );
}
