"use client";

import { Download } from "lucide-react";

// Shared CSV download button used in every report chart card's header.
export default function CsvButton() {
  return (
    <button
      type="button"
      onClick={() => {
        // TODO: actual CSV export is a follow-up task.
      }}
      className="flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-[#E0E5EB] bg-[#F7FBFD] px-3 text-xs font-medium text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors hover:bg-white"
    >
      <Download size={16} stroke="#071123" />
      CSV
    </button>
  );
}
