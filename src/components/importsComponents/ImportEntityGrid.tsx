"use client";

import { useMemo } from "react";
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
  onSelect,
}: {
  entities: ImportEntity[];
  isLoading: boolean;
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SummaryCardSkeleton key={index} />
            ))
          : entities.map((entity) => (
              <ImportEntityCard
                key={entity.key}
                entity={entity}
                entityLabels={entityLabels}
                onSelect={onSelect}
              />
            ))}
      </div>
    </div>
  );
}
