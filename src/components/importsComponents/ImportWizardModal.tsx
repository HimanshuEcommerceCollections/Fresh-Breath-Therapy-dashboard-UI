"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import ImportStepper from "@/src/sections/importsSections/ImportStepper";
import MappingStep from "@/src/sections/importsSections/MappingStep";
import ResolveStep from "@/src/sections/importsSections/ResolveStep";
import PreviewStep from "@/src/sections/importsSections/PreviewStep";
import CommitStep from "@/src/sections/importsSections/CommitStep";
import { useImportBatch } from "@/src/hooks/useImportBatch";
import type { ImportStep } from "@/src/data/importsData/importsData";
import type { ImportEntity } from "@/src/services/importsService";

/**
 * The four-step wizard for one uploaded sheet.
 *
 * The step order isn't cosmetic — each stage depends on the last. Foreign-key
 * questions can't be asked until the columns are mapped (we don't know which
 * column holds the therapist name yet), and the row verdicts can't be
 * computed until those names resolve to real records. So the preview query
 * stays disabled on the mapping step, and every mapping change invalidates
 * the verdicts computed under the old one.
 */
export default function ImportWizardModal({
  batchId,
  entity,
  initialStep = "mapping",
  onClose,
  onRollback,
  isRollingBack,
}: {
  batchId: string;
  entity: ImportEntity;
  initialStep?: ImportStep;
  onClose: () => void;
  onRollback: (batchId: string) => void;
  isRollingBack: boolean;
}) {
  const [step, setStep] = useState<ImportStep>(initialStep);
  const {
    batch,
    preview,
    isLoadingBatch,
    isFetchingPreview,
    isPreviewError,
    refetchPreview,
    updateMapping,
    isSavingMapping,
    saveResolutions,
    isSavingResolutions,
    createMissingRecord,
    isCreatingRecord,
    editRow,
    isEditingRow,
    runCommit,
    commitProgress,
    problemRows,
    // Preview is only meaningful on these two steps. Leaving it enabled on
    // "commit" meant the post-commit cache invalidation refetched it against a
    // committed batch, which the API refuses with a 409 — two red requests and
    // an error toast at the exact moment the import had just succeeded.
  } = useImportBatch(batchId, step === "resolve" || step === "preview");

  // Kick the commit off as soon as the step becomes "commit" — the button
  // that got us here already was the confirmation.
  useEffect(() => {
    if (step === "commit" && !commitProgress) {
      void runCommit();
    }
  }, [step, commitProgress, runCommit]);

  const handleSaveMapping = async (payload: {
    columnMapping: Record<string, string | null>;
    valueMapping: Record<string, Record<string, string>>;
    dateOrder: string;
  }) => {
    await updateMapping(payload);
    setStep("resolve");
  };

  const handleSaveResolutions = async (payload: {
    groups: Record<string, string>;
    rows: Record<string, Record<string, string>>;
  }) => {
    if (
      Object.keys(payload.groups).length > 0 ||
      Object.keys(payload.rows).length > 0
    ) {
      await saveResolutions(payload);
    }
    await refetchPreview();
    setStep("preview");
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-245 flex-col rounded-[18px] border border-[#E0E5EB] bg-[#F7FBFD] shadow-[0px_10px_30px_rgba(7,17,35,0.12)]">
        <div className="flex items-start justify-between gap-4 rounded-t-[18px] border-b border-[#E0E5EB] bg-white px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-[-0.3px] text-[#071123]">
              Import {entity.label}
            </h2>
            <p className="mt-0.5 truncate text-sm text-[#596475]">
              {batch?.filename ?? "Loading…"}
              {batch && <> · {batch.totalRows.toLocaleString()} rows</>}
              {batch?.migrationMode && (
                <span className="text-[#7C3AED]"> · migration mode</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-[#E0E5EB] bg-white px-6 py-4">
          <ImportStepper current={step} onStepChange={setStep} />
        </div>

        <div className="max-h-[calc(100vh-320px)] overflow-y-auto px-6 py-5">
          {/* A failed re-check leaves the LAST GOOD verdicts on screen, which
              read as "your fix didn't work" when in fact the answer was saved
              and only the re-check call was lost. Say so, and offer the retry. */}
          {isPreviewError && step !== "commit" && step !== "mapping" && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3">
              <AlertTriangle size={16} className="shrink-0 text-[#B91C1C]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#B91C1C]">
                  Couldn&apos;t re-check the rows
                </p>
                <p className="text-xs text-[#B91C1C]">
                  Your answers were saved — what&apos;s shown below is from before
                  the last re-check. Retry to refresh it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void refetchPreview()}
                disabled={isFetchingPreview}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[#B91C1C] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isFetchingPreview ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                Retry
              </button>
            </div>
          )}

          {isLoadingBatch || !batch ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#596475]">
              <Loader2 size={16} className="animate-spin text-[#376EF4]" />
              Reading your sheet…
            </div>
          ) : step === "mapping" ? (
            <MappingStep
              batch={batch}
              entity={entity}
              isSaving={isSavingMapping}
              onSave={handleSaveMapping}
            />
          ) : step === "resolve" ? (
            !preview ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#596475]">
                <Loader2 size={16} className="animate-spin text-[#376EF4]" />
                Matching names against the dashboard…
              </div>
            ) : (
              <ResolveStep
                groups={preview.fkGroups}
                entity={entity}
                isSaving={isSavingResolutions}
                isCreatingRecord={isCreatingRecord}
                onSave={handleSaveResolutions}
                onCreateRecord={createMissingRecord}
                onSkip={() => setStep("preview")}
              />
            )
          ) : step === "preview" ? (
            !preview ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#596475]">
                <Loader2 size={16} className="animate-spin text-[#376EF4]" />
                Checking every row…
              </div>
            ) : (
              <PreviewStep
                preview={preview}
                entity={entity}
                isRefreshing={isFetchingPreview}
                isEditingRow={isEditingRow || isSavingResolutions}
                onEditRow={editRow}
                onResolveRow={async ({ rowNumber, values }) => {
                  // Row-level resolutions are keyed {field: {row: id}} — the
                  // same store the Resolve step writes, so a fix made here
                  // and one made there can't disagree.
                  const rows: Record<string, Record<string, string>> = {};
                  for (const [field, id] of Object.entries(values)) {
                    rows[field] = { [String(rowNumber)]: id };
                  }
                  await saveResolutions({ rows });
                }}
                onCommit={() => setStep("commit")}
              />
            )
          ) : (
            <CommitStep
              progress={commitProgress}
              problemRows={problemRows}
              entity={entity}
              onDone={onClose}
              onRollback={() => onRollback(batchId)}
              isRollingBack={isRollingBack}
            />
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
