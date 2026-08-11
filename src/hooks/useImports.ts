// src/hooks/useImports.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importsService } from "@/src/services/importsService";
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
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["imports"] });
  };

  const createImportMutation = useMutation({
    mutationFn: (params: { entity: string; file?: File; sourceUrl?: string }) =>
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
    isLoading: isLoadingEntities || isLoadingHistory,
    createImport: createImportMutation.mutateAsync,
    isCreating: createImportMutation.isPending,
    rollback: rollbackMutation.mutateAsync,
    isRollingBack: rollbackMutation.isPending,
    discard: discardMutation.mutateAsync,
  };
};
