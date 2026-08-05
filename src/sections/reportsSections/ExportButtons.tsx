"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadExport } from "@/src/lib/download";
import { showErrorToast } from "@/src/lib/toast";

// CSV + PDF download pair, used in every report chart card header and on the
// Payments page. The file is generated server-side from the same query that
// produced the chart, so a download can't disagree with what's on screen.
export default function ExportButtons({
  path,
  params,
  baseName,
}: {
  /** Export endpoint, e.g. "/api/exports/reports/sales". */
  path: string;
  /** Extra query params (range, location_id, payment_status…). */
  params?: Record<string, string | undefined>;
  /** Fallback filename if the response has no Content-Disposition. */
  baseName: string;
}) {
  const [busy, setBusy] = useState<"csv" | "pdf" | null>(null);

  async function run(format: "csv" | "pdf") {
    if (busy) return;
    setBusy(format);
    try {
      await downloadExport(path, { ...params, format }, `${baseName}.${format}`);
    } catch {
      showErrorToast(`Could not export the ${format.toUpperCase()} file.`);
    } finally {
      setBusy(null);
    }
  }

  const cls =
    "flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-3 text-xs font-medium text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => run("csv")} disabled={busy !== null} className={cls}>
        {busy === "csv" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} stroke="#071123" />
        )}
        CSV
      </button>
      <button type="button" onClick={() => run("pdf")} disabled={busy !== null} className={cls}>
        {busy === "pdf" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileText size={16} stroke="#071123" />
        )}
        PDF
      </button>
    </div>
  );
}
