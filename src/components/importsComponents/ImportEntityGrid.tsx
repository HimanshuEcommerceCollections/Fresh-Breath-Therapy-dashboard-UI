"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import ImportEntityCard from "@/src/sections/importsSections/ImportEntityCard";
import { SummaryCardSkeleton } from "@/src/components/ui/SummaryCardSkeleton";
import type { ImportEntity } from "@/src/services/importsService";

/**
 * What can be imported, in the order it has to happen.
 *
 * The backend returns these already topologically sorted, so following the
 * grid top-to-bottom never hits an unresolvable link.
 */
export default function ImportEntityGrid({
  entities,
  isLoading,
  busyEntities,
  onSelect,
}: {
  entities: ImportEntity[];
  isLoading: boolean;
  /** Entity key -> what is occupying it. Per entity, because two imports into
   *  different tables do not contend and must not block each other. */
  busyEntities?: Map<string, { filename: string; status: string }>;
  onSelect: (entity: ImportEntity) => void;
}) {
  const entityLabels = useMemo(
    () => Object.fromEntries(entities.map((e) => [e.key, e.label])),
    [entities]
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.2px] text-[#071123]">
          What are you importing?
        </h2>
        <p className="mt-0.5 text-sm text-[#596475]">
          Import them in this order — each one can link to the ones above it.
        </p>
      </div>

      {busyEntities && busyEntities.size > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#7DD3FC] bg-[#F0F9FF] px-4 py-3">
          <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-[#2C7EA1]" />
          <div>
            <p className="text-sm font-medium text-[#075985]">
              {[...busyEntities.entries()]
                .map(([key, v]) => `${entityLabels[key] ?? key}: ${v.filename}`)
                .join(" · ")}
            </p>
            <p className="mt-0.5 text-xs text-[#0C7396]">
              One import at a time per table. Everything else stays open —
              only the tables listed above are busy, and a second import of
              one of them is queued rather than refused.
            </p>
          </div>
        </div>
      )}

      {/* Three across, so the nine entities land as three rows of three. The
          count is driven by the registry, so the skeleton count below matches
          it rather than being hardcoded to whatever it was last time. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <SummaryCardSkeleton key={index} />
            ))
          : entities.map((entity) => (
              <ImportEntityCard
                key={entity.key}
                entity={entity}
                entityLabels={entityLabels}
                disabledReason={
                  busyEntities?.has(entity.key)
                    ? busyEntities.get(entity.key)!.status === "queued"
                      ? "An import of this table is already queued"
                      : "This table is being imported right now"
                    : null
                }
                onSelect={onSelect}
              />
            ))}
      </div>
    </div>
  );
}
