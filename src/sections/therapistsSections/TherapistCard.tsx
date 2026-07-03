"use client";

import { useState } from "react";
import Image from "next/image";
import type { Therapist } from "@/src/data/therapistsData/therapistsData";

// e.g. 600 → "$0.6k", 1100 → "$1.1k", 0 → "$0.0k"
function formatRevenueK(dollars: number): string {
  return `$${(dollars / 1000).toFixed(1)}k`;
}

export default function TherapistCard({
  therapist,
  animate,
  index,
}: {
  therapist: Therapist;
  // Utilization bars sit at 0% until the grid scrolls into view, then grow
  // left-to-right staggered per card — same motion language as the
  // Dashboard's Therapist Utilization bars.
  animate: boolean;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(55,110,244,0.1)]">
          {imgError ? (
            <span className="text-sm font-semibold text-[#376EF4]">
              {therapist.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
          ) : (
            <Image
              src={therapist.avatarUrl}
              alt={therapist.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base font-semibold tracking-[-0.32px] text-[#071123]">
            {therapist.name}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">
            {therapist.credential} · {therapist.location}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">
            {therapist.email}
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        {[
          { value: therapist.activeClients, label: "Active" },
          { value: therapist.sessionsThisMonth, label: "This mo" },
          { value: formatRevenueK(therapist.revenueThisMonth), label: "Revenue" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-lg font-semibold tracking-[-0.45px] text-[#071123]">
              {stat.value}
            </span>
            <span className="text-[10px] font-normal uppercase tracking-[0.12px] text-[#596475]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-[#596475]">
            Utilization
          </span>
          <span className="text-xs font-medium text-[#071123]">
            {therapist.utilizationPercent}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[rgba(55,110,244,0.2)]">
          <div
            className="h-1.5 rounded-full bg-[#376EF4] transition-[width] duration-1000 ease-out"
            style={{
              width: animate ? `${therapist.utilizationPercent}%` : "0%",
              transitionDelay: `${index * 100}ms`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <span className="text-xs font-normal text-[#596475]">
          YTD: {therapist.ytdSessions} sessions
        </span>
        <span className="text-xs font-normal text-[#596475]">
          PTO: {therapist.ptoHours}h
        </span>
      </div>
    </div>
  );
}
