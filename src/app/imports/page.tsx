"use client";

import { useMemo, useState } from "react";
import ImportsPageHeader from "@/src/components/importsComponents/ImportsPageHeader";
import ImportEntityGrid from "@/src/components/importsComponents/ImportEntityGrid";
import ImportHistoryTable from "@/src/components/importsComponents/ImportHistoryTable";
import ImportWizardModal from "@/src/components/importsComponents/ImportWizardModal";
import NewImportModal from "@/src/sections/importsSections/NewImportModal";
import ConfirmDeleteModal from "@/src/components/sharedComponents/ConfirmDeleteModal";
import { useImports } from "@/src/hooks/useImports";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import type { ImportStep } from "@/src/data/importsData/importsData";
import type { ImportBatch, ImportEntity } from "@/src/services/importsService";

interface ActiveWizard {
  batchId: string;
  entity: ImportEntity;
  initialStep: ImportStep;
}

/**
 * Bulk import from a spreadsheet.
 *
 * Admin-only: this writes patient records in bulk, so a Coordinator who can
 * read the dashboard still can't reshape it from a file.
 */
export default function ImportsPage() {
  const { isChecking } = useRequireRole(["Admin"], "/leads");
  const {
    entities,
    history,
    busyEntities,
    isLoading,
    createImport,
    isCreating,
    rollback,
    isRollingBack,
    discard,
  } = useImports();

  const [uploadingFor, setUploadingFor] = useState<ImportEntity | null>(null);
  const [wizard, setWizard] = useState<ActiveWizard | null>(null);
  const [rollingBack, setRollingBack] = useState<ImportBatch | null>(null);
  const [discarding, setDiscarding] = useState<ImportBatch | null>(null);
  const [busyBatchId, setBusyBatchId] = useState<string | null>(null);

  const entityLabels = useMemo(
    () => Object.fromEntries(entities.map((e) => [e.key, e.label])),
    [entities]
  );

  if (isChecking) return null;

  const handleUpload = async (params: {
    file?: File;
    sourceUrl?: string;
    migrationMode: boolean;
  }) => {
    if (!uploadingFor) return;
    const entity = uploadingFor;
    const batch = await createImport({
      entity: entity.key,
      file: params.file,
      sourceUrl: params.sourceUrl,
    });
    setUploadingFor(null);
    setWizard({ batchId: batch.id, entity, initialStep: "mapping" });
  };

  const handleResume = (batch: ImportBatch) => {
    const entity = entities.find((e) => e.key === batch.entity);
    if (!entity) return;
    setWizard({
      batchId: batch.id,
      entity,
      // A batch that already has a reviewed preview picks up there rather
      // than making the admin walk the mapping again.
      initialStep: batch.status === "preview" ? "preview" : "mapping",
    });
  };

  return (
    <div className="flex flex-col gap-6 px-8 pb-12 pt-24">
      <ImportsPageHeader history={history} />

      <ImportEntityGrid
        entities={entities}
        isLoading={isLoading}
        busyEntities={busyEntities}
        onSelect={setUploadingFor}
      />

      <ImportHistoryTable
        history={history}
        entityLabels={entityLabels}
        isLoading={isLoading}
        busyBatchId={busyBatchId}
        onResume={handleResume}
        onRollback={setRollingBack}
        onDiscard={setDiscarding}
      />

      {uploadingFor && (
        <NewImportModal
          entity={uploadingFor}
          isSubmitting={isCreating}
          onClose={() => setUploadingFor(null)}
          onSubmit={handleUpload}
        />
      )}

      {wizard && (
        <ImportWizardModal
          batchId={wizard.batchId}
          entity={wizard.entity}
          initialStep={wizard.initialStep}
          isRollingBack={isRollingBack}
          onClose={() => setWizard(null)}
          onRollback={async (batchId) => {
            await rollback(batchId);
            setWizard(null);
          }}
        />
      )}

      {rollingBack && (
        <ConfirmDeleteModal
          title="Undo this import?"
          message={`This removes everything ${rollingBack.filename} added (${rollingBack.createCount} records) and puts back anything it changed (${rollingBack.updateCount}). If those records have been edited since, those edits are lost too.`}
          onCancel={() => setRollingBack(null)}
          onConfirm={async () => {
            setBusyBatchId(rollingBack.id);
            try {
              await rollback(rollingBack.id);
            } finally {
              setBusyBatchId(null);
              setRollingBack(null);
            }
          }}
        />
      )}

      {discarding && (
        <ConfirmDeleteModal
          title="Discard this import?"
          message={`${discarding.filename} was never imported, so nothing in the dashboard changes. The uploaded rows are deleted.`}
          onCancel={() => setDiscarding(null)}
          onConfirm={async () => {
            await discard(discarding.id);
            setDiscarding(null);
          }}
        />
      )}
    </div>
  );
}
