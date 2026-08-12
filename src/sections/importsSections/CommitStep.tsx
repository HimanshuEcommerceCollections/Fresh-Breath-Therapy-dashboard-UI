"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import PreviewRowItem from "@/src/sections/importsSections/PreviewRowItem";
import { CHUNK_SIZE } from "@/src/data/importsData/importsData";
import type { CommitProgress } from "@/src/hooks/useImportBatch";
import type { ImportEntity, PreviewRow } from "@/src/services/importsService";

/**
 * Step 4 — writing, then the result.
 *
 * The progress bar is real, not indeterminate: the server writes a bounded
 * slice per call and reports what remains, so the total is known after the
 * first round trip. A 5,000-row import is visibly moving rather than a
 * spinner the admin has to trust.
 */
export default function CommitStep({
  progress,
  problemRows,
  entity,
  onDone,
  onRollback,
  isRollingBack,
}: {
  progress: CommitProgress | null;
  problemRows: PreviewRow[];
  entity: ImportEntity;
  onDone: () => void;
  onRollback: () => void;
  isRollingBack: boolean;
}) {
  const fieldLabel = (name: string) =>
    entity.fields.find((f) => f.name === name)?.label ?? name;
  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.processed / progress.total) * 100))
      : 0;

  const isDone = progress?.done ?? false;

  // Identical reasons collapse into one line with a count — ten rows failing
  // for the same reason is one problem to fix, not ten.
  const reasonCounts: Record<string, number> = {};
  for (const row of problemRows) {
    for (const error of row.errors) {
      reasonCounts[error.message] = (reasonCounts[error.message] ?? 0) + 1;
    }
  }
  const reasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-5 rounded-[18px] border border-[#E0E5EB] bg-white px-6 py-12 text-center shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      {isDone ? (
        progress && progress.failed > 0 ? (
          <XCircle size={32} className="text-[#F2A618]" />
        ) : (
          <CheckCircle2 size={32} className="text-[#16A34A]" />
        )
      ) : (
        <Loader2 size={32} className="animate-spin text-[#376EF4]" />
      )}

      {progress?.queued && (
        <div className="w-full max-w-125 rounded-xl border border-[#D8B4FE] bg-[#FAF5FF] px-4 py-3 text-left">
          <p className="text-sm font-medium text-[#6B21A8]">
            Waiting for &ldquo;{progress.queuedBehind}&rdquo; to finish
          </p>
          <p className="mt-0.5 text-xs text-[#7C3AED]">
            {/* Queued, not refused: the request is recorded server-side and
                starts on its own. Nothing here needs doing. */}
            {progress.queuePosition
              ? `${progress.queuePosition} import(s) ahead of this one. `
              : "Next in line. "}
            This starts by itself — you can leave the page open.
          </p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold tracking-[-0.3px] text-[#071123]">
          {isDone
            ? "Import finished"
            : progress?.queued
              ? "Queued"
              : "Writing records…"}
        </h3>
        <p className="mt-1 text-sm text-[#596475]">
          {progress
            ? `${progress.processed.toLocaleString()} of ${progress.total.toLocaleString()} rows · ${percent}%`
            : "Starting — claiming the import so nothing else can run…"}
        </p>
        {!isDone && progress && (
          <p className="mt-1 text-xs text-[#94A3B8]">
            Written in batches of {CHUNK_SIZE}; it&apos;s safe to leave this open.
          </p>
        )}
      </div>

      <div className="h-2 w-full max-w-95 overflow-hidden rounded-full bg-[#E2E8F0]">
        <div
          className="h-full rounded-full bg-[#376EF4] transition-[width] duration-300"
          style={{ width: `${isDone ? 100 : percent}%` }}
        />
      </div>

      {progress && (
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
          <span className="text-[#15803D]">
            <strong className="font-semibold">{progress.created}</strong> added
          </span>
          <span className="text-[#2C7EA1]">
            <strong className="font-semibold">{progress.updated}</strong> updated
          </span>
          {progress.failed > 0 && (
            <span className="text-[#B91C1C]">
              <strong className="font-semibold">{progress.failed}</strong> failed
            </span>
          )}
        </div>
      )}

      {isDone && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onDone}
            className="cursor-pointer rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90"
          >
            Done
          </button>
          <button
            type="button"
            onClick={onRollback}
            disabled={isRollingBack}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E0E5EB] px-4 py-2 text-sm font-medium text-[#B91C1C] transition-colors hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRollingBack && <Loader2 size={14} className="animate-spin" />}
            Undo this import
          </button>
        </div>
      )}

      {isDone && (
        <p className="max-w-105 text-xs text-[#596475]">
          You can undo this from the import history at any time — it removes
          everything this file added and puts back anything it changed.
        </p>
      )}
      </div>

      {isDone && problemRows.length > 0 && (
        <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="border-b border-[#E0E5EB] px-5 py-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#071123]">
              <XCircle size={15} className="text-[#B91C1C]" />
              {problemRows.length} row{problemRows.length === 1 ? "" : "s"} weren&apos;t
              imported
            </h4>
            <p className="mt-1 text-xs text-[#596475]">
              Fix these in your sheet and upload it again — the rows that did
              import won&apos;t be duplicated.
            </p>

            {reasons.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {reasons.map(([message, count]) => (
                  <li
                    key={message}
                    className="flex items-start gap-2 rounded-lg bg-[#FEF2F2] px-3 py-2"
                  >
                    <span className="mt-0.5 shrink-0 rounded-md bg-[#FEE2E2] px-1.5 text-xs font-semibold text-[#B91C1C]">
                      {count}
                    </span>
                    <span className="text-xs text-[#B91C1C]">{message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="max-h-90 overflow-y-auto">
            {problemRows.map((row) => (
              <PreviewRowItem
                key={row.rowNumber}
                row={row}
                fieldLabel={fieldLabel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
