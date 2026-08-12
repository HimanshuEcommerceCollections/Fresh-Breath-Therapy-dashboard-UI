"use client";

import { Clock, Loader2, Undo2 } from "lucide-react";
import ImportStatusBadge from "@/src/sections/importsSections/ImportStatusBadge";
import { IMPORTS_TABLE_GRID } from "@/src/sections/importsSections/importsTableGrid";
import { batchStatusBadges } from "@/src/data/importsData/importStatusBadges";
import { BATCH_STATUS_LABELS } from "@/src/data/importsData/importsData";
import type { ImportBatch } from "@/src/services/importsService";

export default function ImportHistoryRow({
  batch,
  entityLabel,
  isBusy,
  onResume,
  onRollback,
  onDiscard,
}: {
  batch: ImportBatch;
  entityLabel: string;
  isBusy: boolean;
  onResume: (batch: ImportBatch) => void;
  onRollback: (batch: ImportBatch) => void;
  onDiscard: (batch: ImportBatch) => void;
}) {
  const badge = batchStatusBadges[batch.status] ?? batchStatusBadges.parsing;
  const isCommitted = batch.status === "committed";
  const isRunning = batch.status === "committing";
  const isQueued = batch.status === "queued";
  // Resume means "an attempt stopped part-way, continue it" — so it appears
  // only when one actually did. A batch that has never been started shows
  // Review instead, and one that is running or queued shows neither: offering
  // Resume on an in-flight import invited a second request for the same rows.
  const hasFailed = Boolean(batch.lastFailure);
  const isReviewable =
    !isRunning && !isQueued &&
    ["mapping", "preview", "parsing"].includes(batch.status);

  return (
    <div className={`${IMPORTS_TABLE_GRID} border-b border-[#E0E5EB] px-5 py-3.5 last:border-b-0`}>
      <p className="min-w-0 truncate text-sm font-medium text-[#071123]" title={batch.filename}>
        {batch.filename}
      </p>

      <p className="text-sm text-[#596475]">{entityLabel}</p>

      <div>
        <ImportStatusBadge
          label={BATCH_STATUS_LABELS[batch.status] ?? batch.status}
          bg={badge.bg}
          text={badge.text}
        />
        {batch.migrationMode && (
          <p className="mt-1 text-xs text-[#7C3AED]">Migration mode</p>
        )}
        {hasFailed && (
          <p className="mt-1 text-xs text-[#B91C1C]" title={batch.lastFailure ?? ""}>
            {batch.lastFailure}
          </p>
        )}
      </div>

      <p className="text-sm text-[#596475]">
        {isCommitted ? (
          <>
            {batch.createCount} added · {batch.updateCount} updated
            {batch.errorCount > 0 && (
              <span className="text-[#B91C1C]"> · {batch.errorCount} skipped</span>
            )}
          </>
        ) : (
          <>{batch.totalRows.toLocaleString()} rows</>
        )}
      </p>

      <p className="text-sm text-[#596475]">
        {new Date(batch.createdAt).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>

      <div className="flex items-center justify-end gap-1.5">
        {isRunning && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#2C7EA1]">
            <Loader2 size={12} className="animate-spin" />
            Importing…
          </span>
        )}
        {isQueued && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#7C3AED]">
            <Clock size={12} />
            Waiting its turn
          </span>
        )}
        {isReviewable && (
          <>
            <button
              type="button"
              onClick={() => onResume(batch)}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#376EF4] transition-colors hover:bg-[#F5F8FF]"
            >
              {hasFailed ? "Resume" : "Review"}
            </button>
            <button
              type="button"
              onClick={() => onDiscard(batch)}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            >
              Discard
            </button>
          </>
        )}
        {isCommitted && (
          <button
            type="button"
            onClick={() => onRollback(batch)}
            disabled={isBusy}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#B91C1C] transition-colors hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isBusy ? <Loader2 size={12} className="animate-spin" /> : <Undo2 size={12} />}
            Undo
          </button>
        )}
      </div>
    </div>
  );
}
