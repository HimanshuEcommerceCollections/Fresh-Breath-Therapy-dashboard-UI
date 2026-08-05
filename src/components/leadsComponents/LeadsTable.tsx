import type { Lead } from "@/src/services/leadsService";
import LeadsTableHeaderRow from "@/src/sections/leadsSections/LeadsTableHeaderRow";
import LeadsTableRow from "@/src/sections/leadsSections/LeadsTableRow";
import { LEADS_TABLE_GRID } from "@/src/sections/leadsSections/leadsTableGrid";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";
import InfiniteScrollSentinel from "@/src/components/sharedComponents/InfiniteScrollSentinel";

export default function LeadsTable({
  leads,
  isLoading,
  onEdit,
  onDelete,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  leads: Lead[];
  isLoading?: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <LeadsTableHeaderRow />
      <div>
        {isLoading ? (
          <TableSkeleton gridClassName={LEADS_TABLE_GRID} columns={7} rows={7} />
        ) : (
          leads.map((lead) => (
            <LeadsTableRow key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
      {!isLoading && onLoadMore && (
        <InfiniteScrollSentinel
          onIntersect={onLoadMore}
          hasNextPage={hasNextPage}
          isFetchingNextPage={Boolean(isFetchingNextPage)}
        />
      )}
    </div>
  );
}
