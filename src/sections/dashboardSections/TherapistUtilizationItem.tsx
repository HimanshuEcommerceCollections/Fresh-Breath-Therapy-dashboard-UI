"use client";

import type { TherapistUtilization } from "@/src/data/dashboardData/therapistUtilizationData";

export default function TherapistUtilizationItem({
  therapist,
  fillPercent,
  animate,
  index,
}: {
  therapist: TherapistUtilization;
  fillPercent: number;
  // Bars sit at 0% width until the parent card scrolls into view, then the
  // CSS transition grows each fill left-to-right, staggered top to bottom —
  // the same motion language as the Lead Conversion Funnel bars.
  animate: boolean;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="min-w-0 truncate">
          <span className="text-sm font-medium tracking-[-0.154px] text-[#071123]">
            {therapist.name}
          </span>
          <span className="text-xs font-medium text-[#596475]">
            {" "}
            · {therapist.city}
          </span>
        </span>
        <span className="shrink-0 text-xs font-normal text-[#596475]">
          {therapist.sessionsCount} sess
          {therapist.ptoHours !== undefined ? ` · ${therapist.ptoHours}h PTO` : ""}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-[rgba(55,110,244,0.2)]">
        <div
          className="h-1.5 rounded-full bg-[#376EF4] transition-[width] duration-1000 ease-out"
          style={{
            width: animate ? `${fillPercent}%` : "0%",
            transitionDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  );
}
