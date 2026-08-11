"use client";

import { ArrowRight, Lock } from "lucide-react";
import type { ImportEntity } from "@/src/services/importsService";

/**
 * One importable entity in the picker.
 *
 * Disabled while a prerequisite is empty. That ordering isn't a stylistic
 * preference — clients carry a required therapist, so importing them into an
 * empty therapists table would fail every single row. Greying the card out
 * turns that into a visible prerequisite rather than a confusing wall of
 * identical errors after the upload.
 */
export default function ImportEntityCard({
  entity,
  entityLabels,
  onSelect,
}: {
  entity: ImportEntity;
  entityLabels: Record<string, string>;
  onSelect: (entity: ImportEntity) => void;
}) {
  const requiredCount = entity.fields.filter((f) => f.required).length;

  return (
    <button
      type="button"
      disabled={!entity.ready}
      onClick={() => onSelect(entity)}
      className={`group flex flex-col gap-3 rounded-[18px] border p-5 text-left transition-colors ${
        entity.ready
          ? "cursor-pointer border-[#E0E5EB] bg-white hover:border-[#376EF4] hover:bg-[#F7FBFD]"
          : "border-[#E0E5EB] bg-[#F7FBFD]"
      } shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`text-base font-semibold tracking-[-0.2px] ${
              entity.ready ? "text-[#071123]" : "text-[#596475]"
            }`}
          >
            {entity.label}
          </h3>
          <p className="mt-0.5 text-sm text-[#596475]">
            {entity.existingCount.toLocaleString()} in the dashboard
          </p>
        </div>
        {entity.ready ? (
          <ArrowRight
            size={18}
            className="mt-1 shrink-0 text-[#94A3B8] transition-colors group-hover:text-[#376EF4]"
          />
        ) : (
          <Lock size={16} className="mt-1 shrink-0 text-[#94A3B8]" />
        )}
      </div>

      {entity.ready ? (
        <p className="text-xs text-[#596475]">
          {requiredCount} required column{requiredCount === 1 ? "" : "s"}
          {entity.dependsOn.length > 0 && (
            <> · links to {entity.dependsOn.map((d) => entityLabels[d] ?? d).join(", ")}</>
          )}
        </p>
      ) : (
        <p className="rounded-lg bg-[#FFEDD5] px-2.5 py-1.5 text-xs font-medium text-[#9A611D]">
          Import{" "}
          {entity.blockedBy.map((d) => entityLabels[d] ?? d).join(" and ")} first
        </p>
      )}
    </button>
  );
}
