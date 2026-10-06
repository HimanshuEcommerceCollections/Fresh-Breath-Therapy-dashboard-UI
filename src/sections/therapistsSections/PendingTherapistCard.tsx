"use client";

import { Check, Loader2 } from "lucide-react";
import type { RecentTherapistAdd } from "@/src/hooks/useTherapists";

// Stand-in card for a therapist being added. Spins while the request is in
// flight, then shows a tick — used for the tick only until the refetched
// roster contains the real card, which takes over from there.
export default function PendingTherapistCard({ add }: { add: RecentTherapistAdd }) {
  const saved = add.status === "saved";

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-[18px] border border-dashed bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] ${
        saved ? "border-[#86EFAC]" : "border-[#BFD3FE]"
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          role="status"
          aria-label={saved ? "Therapist added" : "Adding therapist"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            saved ? "bg-[#16A34A] text-white" : "bg-[rgba(55,110,244,0.1)] text-[#376EF4]"
          }`}
        >
          {saved ? <Check size={22} strokeWidth={3} /> : <Loader2 size={22} className="animate-spin" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base font-semibold tracking-[-0.32px] text-[#071123]">
            {add.name}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">{add.email}</span>
          <span className={`text-xs font-medium ${saved ? "text-[#16A34A]" : "text-[#376EF4]"}`}>
            {saved ? "Therapist added" : "Adding therapist…"}
          </span>
        </div>
      </div>
    </div>
  );
}
