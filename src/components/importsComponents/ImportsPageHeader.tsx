"use client";

import type { ImportBatch } from "@/src/services/importsService";

export default function ImportsPageHeader({ history }: { history: ImportBatch[] }) {
  const committed = history.filter((b) => b.status === "committed");
  const rowsImported = committed.reduce(
    (total, b) => total + b.createCount + b.updateCount,
    0
  );

  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-[-0.75px] text-[#071123]">
          Import data
        </h1>
        <p className="text-sm font-normal tracking-[-0.154px] text-[#596475]">
          {committed.length === 0
            ? "Bring records in from a spreadsheet — nothing is saved until you review it"
            : `${committed.length} import${committed.length === 1 ? "" : "s"} · ${rowsImported.toLocaleString()} records brought in`}
        </p>
      </div>
    </div>
  );
}
