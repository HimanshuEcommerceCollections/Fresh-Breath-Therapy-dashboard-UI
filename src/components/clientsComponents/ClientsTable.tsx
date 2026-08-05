import type { Client } from "@/src/services/clientsService";
import { CLIENTS_TABLE_GRID } from "@/src/sections/clientsSections/clientsTableGrid";
import ClientTableRow from "@/src/sections/clientsSections/ClientTableRow";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";
import InfiniteScrollSentinel from "@/src/components/sharedComponents/InfiniteScrollSentinel";

const COLUMNS = [
  "Client",
  "Therapist",
  "Location",
  "Sessions",
  "Lifetime $",
  "Status",
  "", // action column has no header label
];

export default function ClientsTable({
  clients,
  isLoading,
  onEdit,
  onDelete,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  clients: Client[];
  isLoading?: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${CLIENTS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column, index) => (
          <div
            key={column || `col-${index}`}
            className="px-2 py-2.5 text-sm font-medium leading-5 tracking-[-0.154px] text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {isLoading ? (
          <TableSkeleton gridClassName={CLIENTS_TABLE_GRID} columns={COLUMNS.length} rows={7} />
        ) : (
          clients.map((client) => (
            <ClientTableRow key={client.id} client={client} onEdit={onEdit} onDelete={onDelete} />
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
