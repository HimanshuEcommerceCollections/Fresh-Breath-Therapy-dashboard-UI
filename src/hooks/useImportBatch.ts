// src/hooks/useImportBatch.ts
"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  importsService,
  type ImportBatchDetail,
  type ImportPreview,
} from "@/src/services/importsService";
import { showErrorToast, showSuccessToast } from "@/src/lib/toast";

export interface CommitProgress {
  processed: number;
  total: number;
  created: number;
  updated: number;
  failed: number;
  done: boolean;
  // Set while another import of the same entity holds the table. The request
  // is accepted and recorded server-side; this loop keeps polling and starts
  // by itself when the entity frees up.
  queued?: boolean;
  queuePosition?: number;
  queuedBehind?: string | null;
}

/**
 * Drives one import through the wizard.
 *
 * The preview query is the centre of it: it is a dry run that re-validates
 * from the stored raw rows on every call, so correcting a mapping or
 * answering a name question and refetching gives an updated verdict without
 * re-uploading the file. Nothing it does writes to a patient record.
 *
 * `enabled` gates the preview so it doesn't fire while the admin is still on
 * the mapping step — validating a mapping she hasn't finished editing would
 * produce a wall of errors about her own unfinished work.
 */
export const useImportBatch = (batchId: string | null, previewEnabled: boolean) => {
  const queryClient = useQueryClient();
  const [commitProgress, setCommitProgress] = useState<CommitProgress | null>(null);
  const isCommittingRef = useRef(false);

  const { data: batch, isLoading: isLoadingBatch } = useQuery<ImportBatchDetail>({
    queryKey: ["imports", "batch", batchId],
    queryFn: () => importsService.fetchBatch(batchId as string),
    enabled: Boolean(batchId),
  });

  const {
    data: preview,
    isLoading: isLoadingPreview,
    isFetching: isFetchingPreview,
    // Surfaced deliberately. React Query keeps the LAST GOOD preview when a
    // refetch fails, and the client suppresses the toast for a bare network
    // error — so without this the admin sits looking at pre-fix verdicts
    // ("Needs a decision" on a row she already answered) with no hint that
    // anything failed and no way to retry.
    isError: isPreviewError,
    refetch: refetchPreview,
  } = useQuery<ImportPreview>({
    queryKey: ["imports", "preview", batchId],
    queryFn: () => importsService.fetchPreview(batchId as string, { limit: 200 }),
    enabled: Boolean(batchId) && previewEnabled,
    // The preview reflects the mapping as it stood when it ran; anything
    // stale would show the admin verdicts for a mapping she has since
    // changed, which is worse than a brief spinner.
    staleTime: 0,
  });

  /**
   * Rows that didn't make it, fetched once the commit finishes.
   *
   * Reads the stored verdicts rather than the preview, which refuses to
   * re-validate a committed batch — so the final screen can say WHY ten rows
   * failed instead of only that they did.
   */
  const { data: problemRows = [] } = useQuery({
    queryKey: ["imports", "rows", batchId, "problems"],
    queryFn: () =>
      importsService.fetchRows(batchId as string, {
        status: "failed,error,needs_input",
        limit: 200,
      }),
    enabled: Boolean(batchId) && Boolean(commitProgress?.done),
  });

  const setBatchData = (next: ImportBatchDetail) => {
    queryClient.setQueryData(["imports", "batch", batchId], next);
  };

  const updateMappingMutation = useMutation({
    mutationFn: (payload: {
      columnMapping?: Record<string, string | null>;
      valueMapping?: Record<string, Record<string, string>>;
      dateOrder?: string;
      migrationMode?: boolean;
    }) => importsService.updateMapping(batchId as string, payload),
    onSuccess: (next) => {
      setBatchData(next);
      // Any mapping change invalidates every verdict computed under the old one.
      queryClient.invalidateQueries({ queryKey: ["imports", "preview", batchId] });
    },
  });

  const editRowMutation = useMutation({
    mutationFn: (payload: {
      rowNumber: number;
      values: Record<string, unknown>;
    }) => importsService.editRow(batchId as string, payload.rowNumber, payload.values),
    onSuccess: () => {
      // The row's verdict changed, and a fixed row can also change the batch
      // counts, so the whole preview is refetched rather than patched locally.
      queryClient.invalidateQueries({ queryKey: ["imports", "preview", batchId] });
    },
  });

  const createRecordMutation = useMutation({
    mutationFn: (payload: {
      groupKey: string;
      target: string;
      values: Record<string, unknown>;
    }) => importsService.createMissingRecord(batchId as string, payload),
    onSuccess: (candidate) => {
      showSuccessToast(`Added ${candidate.label}`);
      // The new record changes what the resolver can match, and it's a real
      // row in the app now — so the dropdowns that list them are stale too.
      queryClient.invalidateQueries({ queryKey: ["imports", "preview", batchId] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["therapists"] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (payload: {
      groups?: Record<string, string>;
      rows?: Record<string, Record<string, string>>;
    }) => importsService.updateResolutions(batchId as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imports", "preview", batchId] });
    },
  });

  /**
   * Runs the chunked commit to completion, updating progress as it goes.
   *
   * A loop rather than one call because the backend is serverless and writes
   * a bounded slice per request. Each response reports what remains, so the
   * total is known from the first round trip and the progress bar is real
   * rather than indeterminate.
   */
  const runCommit = useCallback(async () => {
    // Re-entry guard. React StrictMode double-invokes effects in development,
    // so the effect that starts the commit fired twice before the first call
    // had set any state to block it — two concurrent loops. The server picks
    // its slice by row status, and rows only leave "pending" once their chunk
    // commits, so two overlapping callers can select the SAME rows and write
    // them twice. A ref blocks it synchronously; state would be too late.
    if (!batchId || isCommittingRef.current) return null;
    isCommittingRef.current = true;

    let created = 0;
    let updated = 0;
    let failed = 0;
    let processed = 0;
    let total = 0;
    let done = false;

    try {
      while (!done) {
        const result = await importsService.commitChunk(batchId);
        created += result.created;
        updated += result.updated;
        failed += result.failed;
        processed += result.processed;
        if (total === 0) total = processed + result.remaining;
        done = result.done;

        setCommitProgress({ processed, total, created, updated, failed, done });

        // A slice that processed nothing but claims work remains would spin
        // forever — stop and let the admin see where it got to.
        if (result.processed === 0 && !result.done) break;
      }

      // Imported rows are now real records, so every list in the app is stale.
      await queryClient.invalidateQueries();

      // Don't call it a success when nothing was written. Every row failing
      // still reports done=true, and a green "Imported — 0 added, 0 updated,
      // 6 failed" toast is how a total failure reads as a success.
      if (created + updated === 0 && failed > 0) {
        showErrorToast(
          `Nothing imported — all ${failed} rows failed. Open the import to see why.`
        );
      } else {
        showSuccessToast(
          `Imported — ${created} added, ${updated} updated` +
            (failed ? `, ${failed} failed` : "")
        );
      }
      return { created, updated, failed };
    } finally {
      isCommittingRef.current = false;
    }
  }, [batchId, queryClient]);

  return {
    batch,
    preview,
    isLoadingBatch,
    isLoadingPreview,
    isFetchingPreview,
    isPreviewError,
    refetchPreview,
    updateMapping: updateMappingMutation.mutateAsync,
    isSavingMapping: updateMappingMutation.isPending,
    saveResolutions: resolveMutation.mutateAsync,
    isSavingResolutions: resolveMutation.isPending,
    createMissingRecord: createRecordMutation.mutateAsync,
    isCreatingRecord: createRecordMutation.isPending,
    editRow: editRowMutation.mutateAsync,
    isEditingRow: editRowMutation.isPending,
    runCommit,
    commitProgress,
    problemRows,
  };
};
