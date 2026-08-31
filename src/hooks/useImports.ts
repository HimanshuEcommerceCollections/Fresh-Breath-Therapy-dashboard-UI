// src/hooks/useImports.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importsService, type ImportBatch } from "@/src/services/importsService";
import { showSuccessToast } from "@/src/lib/toast";

/**
 * The import landing page: what can be imported, and what has been.
 *
 * `entities` carries each entity's readiness, which is what stops the admin
 * starting a clients import before any therapist exists — that would fail
 * every row on a required foreign key and look like the importer was broken.
 */
export const useImports = () => {
  const queryClient = useQueryClient();

  const { data: entities = [], isLoading: isLoadingEntities } = useQuery({
    queryKey: ["imports", "entities"],
    queryFn: () => importsService.fetchEntities(),
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["imports", "history"],
    queryFn: () => importsService.fetchHistory(),
    // While something is being written, poll — the run may have been started
    // in another tab or by another admin, and this list is how everyone else
    // finds out that imports are currently blocked.
    refetchInterval: (query) =>
      (query.state.data as ImportBatch[] | undefined)?.some(
        (b) => b.status === "committing" || b.status === "queued"
      )
        ? 2000
        : false,
  });

  /**
   * Which entities are currently busy, and with what.
   *
   * Per entity rather than one global flag: a therapists import and a sessions
   * import touch different tables and no longer wait on each other, so only
   * the entity actually being written may be blocked. Queued batches count as
   * busy too — starting a third while one runs and one waits would just join
   * the back of the same queue.
   */
  const busyEntities = new Map<string, { filename: string; status: string }>();
  for (const b of history) {
    if (b.status === "committing" || b.status === "queued") {
      if (!busyEntities.has(b.entity)) {
        busyEntities.set(b.entity, { filename: b.filename, status: b.status });
      }
    }
  }

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["imports"] });
  };

  const createImportMutation = useMutation({
    mutationFn: (params: { entity: string; file?: File }) =>
      importsService.createImport(params),
    onSuccess: invalidate,
  });

  const rollbackMutation = useMutation({
    mutationFn: (batchId: string) => importsService.rollback(batchId),
    onSuccess: (result) => {
      showSuccessToast(
        `Rolled back — ${result.deleted} removed, ${result.reverted} reverted`
      );
      // The rollback touched real records, so every list that reads them is
      // now stale, not just the import history.
      queryClient.invalidateQueries();
    },
  });

  const discardMutation = useMutation({
    mutationFn: (batchId: string) => importsService.discard(batchId),
    onSuccess: () => {
      showSuccessToast("Import discarded");
      invalidate();
    },
  });

  return {
    entities,
    history,
    busyEntities,
    isLoading: isLoadingEntities || isLoadingHistory,
    createImport: createImportMutation.mutateAsync,
    isCreating: createImportMutation.isPending,
    rollback: rollbackMutation.mutateAsync,
    isRollingBack: rollbackMutation.isPending,
    discard: discardMutation.mutateAsync,
  };
};
