"use client";

import ImportHistoryRow from "@/src/sections/importsSections/ImportHistoryRow";
import { IMPORTS_TABLE_GRID } from "@/src/sections/importsSections/importsTableGrid";
import { TableSkeleton } from "@/src/components/ui/TableRowSkeleton";
import type { ImportBatch } from "@/src/services/importsService";

const HEADERS = ["File", "Type", "Status", "Result", "Date", ""];

export default function ImportHistoryTable({
  history,
  entityLabels,
  isLoading,
  busyBatchId,
  onResume,
  onRollback,
  onDiscard,
}: {
  history: ImportBatch[];
  entityLabels: Record<string, string>;
  isLoading: boolean;
  busyBatchId: string | null;
  onResume: (batch: ImportBatch) => void;
  onRollback: (batch: ImportBatch) => void;
  onDiscard: (batch: ImportBatch) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.2px] text-[#071123]">
          Import history
        </h2>
        <p className="mt-0.5 text-sm text-[#596475]">
          Every import is recorded and can be undone.
        </p>
      </div>

      <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className={`${IMPORTS_TABLE_GRID} border-b border-[#E0E5EB] px-5 py-3`}>
          {HEADERS.map((header, index) => (
            <p
              key={header || index}
              className={`text-xs font-semibold uppercase tracking-wide text-[#596475] ${
                index === HEADERS.length - 1 ? "text-right" : ""
              }`}
            >
              {header}
            </p>
          ))}
        </div>

        {isLoading ? (
          <TableSkeleton gridClassName={IMPORTS_TABLE_GRID} columns={6} rows={3} />
        ) : history.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#596475]">
            No imports yet. Pick what you&apos;re importing above to get started.
          </p>
        ) : (
          history.map((batch) => (
            <ImportHistoryRow
              key={batch.id}
              batch={batch}
              entityLabel={entityLabels[batch.entity] ?? batch.entity}
              isBusy={busyBatchId === batch.id}
              onResume={onResume}
              onRollback={onRollback}
              onDiscard={onDiscard}
            />
          ))
        )}
      </div>
    </div>
  );
}
