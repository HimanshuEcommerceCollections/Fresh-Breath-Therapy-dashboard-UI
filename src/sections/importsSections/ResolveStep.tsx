"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import FkGroupCard from "@/src/sections/importsSections/FkGroupCard";
import AddMissingRecordModal from "@/src/sections/importsSections/AddMissingRecordModal";
import { useImports } from "@/src/hooks/useImports";
import type { FkGroup, ImportEntity } from "@/src/services/importsService";

/**
 * Step 2 — settle every name the sheet refers to.
 *
 * Questions first, already-matched names collapsed beneath. Groups arrive
 * already split by context, so "Sarah Chen" appears once per location rather
 * than once overall — and a group can be expanded to set rows individually
 * when even that isn't enough to tell two people apart.
 */
export default function ResolveStep({
  groups,
  entity,
  isSaving,
  isCreatingRecord,
  onSave,
  onCreateRecord,
  onSkip,
}: {
  groups: FkGroup[];
  entity: ImportEntity;
  isSaving: boolean;
  isCreatingRecord: boolean;
  onSave: (payload: {
    groups: Record<string, string>;
    rows: Record<string, Record<string, string>>;
  }) => void;
  onCreateRecord: (payload: {
    groupKey: string;
    target: string;
    values: Record<string, unknown>;
  }) => Promise<unknown>;
  onSkip: () => void;
}) {
  // The form for a missing record is built from the TARGET entity's fields
  // (a session's missing "client" needs the clients schema, not sessions').
  // Already cached by the page, so this is a cache read, not a second fetch.
  const { entities } = useImports();
  const [addingFor, setAddingFor] = useState<FkGroup | null>(null);
  // groupKey -> chosen target id
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // field -> rowNumber -> chosen target id. Always beats the group answer.
  const [rowAnswers, setRowAnswers] = useState<
    Record<string, Record<number, string>>
  >({});
  const [showResolved, setShowResolved] = useState(false);

  const { pending, resolved } = useMemo(() => {
    const needsInput = (g: FkGroup) =>
      g.status === "ambiguous" || g.status === "missing";
    return {
      pending: groups.filter(needsInput),
      resolved: groups.filter((g) => !needsInput(g)),
    };
  }, [groups]);

  const fieldLabel = (fieldName: string) =>
    entity.fields.find((f) => f.name === fieldName)?.label ?? fieldName;

  // A group is settled either by one choice for all its rows, or by every
  // row having been set individually.
  const isSettled = (group: FkGroup) => {
    if (answers[group.key]) return true;
    const byRow = rowAnswers[group.field] ?? {};
    return group.rows.length > 0 && group.rows.every((r) => byRow[r.rowNumber]);
  };

  const answeredCount = pending.filter(isSettled).length;
  const allAnswered = answeredCount === pending.length;

  const handleSave = () => {
    const groupPayload: Record<string, string> = {};
    for (const group of pending) {
      const chosen = answers[group.key];
      if (chosen) groupPayload[group.key] = chosen;
    }

    const rowPayload: Record<string, Record<string, string>> = {};
    for (const [field, byRow] of Object.entries(rowAnswers)) {
      const entries = Object.entries(byRow).filter(([, id]) => id);
      if (entries.length === 0) continue;
      rowPayload[field] = Object.fromEntries(entries);
    }

    onSave({ groups: groupPayload, rows: rowPayload });
  };

  if (pending.length === 0) {
    const autoMatched = resolved.filter((g) => g.matchedBy).length;
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[#E0E5EB] bg-white px-6 py-12 text-center shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <CheckCircle2 size={28} className="text-[#16A34A]" />
        <div>
          <p className="text-base font-semibold text-[#071123]">
            Every name matched
          </p>
          <p className="mt-1 text-sm text-[#596475]">
            All {resolved.length} referenced record
            {resolved.length === 1 ? "" : "s"} were found
            {autoMatched > 0 && (
              <>
                {" "}
                — {autoMatched} of them narrowed down by location
              </>
            )}
            .
          </p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="mt-1 cursor-pointer rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90"
        >
          Continue to review
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#071123]">
              {pending.length} name{pending.length === 1 ? "" : "s"} need a decision
            </h3>
            <p className="mt-0.5 text-xs text-[#596475]">
              Each one covers only the rows listed under it — expand a group to
              set individual rows.
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium text-[#596475]">
            {answeredCount} of {pending.length} answered
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {Object.entries(
            pending.reduce<Record<string, FkGroup[]>>((acc, group) => {
              (acc[group.field] ??= []).push(group);
              return acc;
            }, {})
          ).map(([fieldName, fieldGroups]) => (
            <div key={fieldName} className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#596475]">
                {fieldLabel(fieldName)}
              </p>
              {fieldGroups.map((group) => (
                <FkGroupCard
                  key={group.key}
                  group={group}
                  selectedId={answers[group.key] ?? null}
                  rowSelections={rowAnswers[group.field] ?? {}}
                  onSelect={(id) =>
                    setAnswers((previous) => ({ ...previous, [group.key]: id }))
                  }
                  onSelectRow={(rowNumber, id) =>
                    setRowAnswers((previous) => ({
                      ...previous,
                      [group.field]: {
                        ...(previous[group.field] ?? {}),
                        [rowNumber]: id,
                      },
                    }))
                  }
                  onAddNew={() => setAddingFor(group)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {resolved.length > 0 && (
        <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <button
            type="button"
            onClick={() => setShowResolved((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3.5 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[#071123]">
              <CheckCircle2 size={15} className="text-[#16A34A]" />
              {resolved.length} matched automatically
              {resolved.some((g) => g.matchedBy) && (
                <span className="text-xs font-normal text-[#596475]">
                  ({resolved.filter((g) => g.matchedBy).length} narrowed down by
                  location)
                </span>
              )}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-[#596475] transition-transform ${
                showResolved ? "rotate-180" : ""
              }`}
            />
          </button>
          {showResolved && (
            <div className="flex flex-col gap-2 border-t border-[#E0E5EB] p-4">
              {resolved.map((group) => (
                <FkGroupCard
                  key={group.key}
                  group={group}
                  selectedId={answers[group.key] ?? null}
                  rowSelections={rowAnswers[group.field] ?? {}}
                  onSelect={(id) =>
                    setAnswers((previous) => ({ ...previous, [group.key]: id }))
                  }
                  onSelectRow={(rowNumber, id) =>
                    setRowAnswers((previous) => ({
                      ...previous,
                      [group.field]: {
                        ...(previous[group.field] ?? {}),
                        [rowNumber]: id,
                      },
                    }))
                  }
                  onAddNew={() => setAddingFor(group)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!allAnswered || isSaving}
          onClick={handleSave}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          {allAnswered
            ? "Save answers and continue"
            : `${pending.length - answeredCount} left to answer`}
        </button>
      </div>

      {addingFor && (() => {
        const target = entities.find((e) => e.key === addingFor.target);
        if (!target) return null;
        return (
          <AddMissingRecordModal
            group={addingFor}
            target={target}
            isSaving={isCreatingRecord}
            onClose={() => setAddingFor(null)}
            onSubmit={async (values) => {
              await onCreateRecord({
                groupKey: addingFor.key,
                target: addingFor.target,
                values,
              });
              // The backend resolves the group against the new record, so
              // refetching the preview is enough — no local answer to record.
              setAddingFor(null);
            }}
          />
        );
      })()}
    </div>
  );
}
