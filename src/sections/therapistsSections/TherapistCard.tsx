"use client";

import { useState } from "react";
import Image from "next/image";
import type { Therapist } from "@/src/services/therapistsService";

// e.g. 600 → "$0.6k", 1100 → "$1.1k", 0 → "$0.0k"
function formatRevenueK(dollars: number): string {
  return `$${(dollars / 1000).toFixed(1)}k`;
}

export default function TherapistCard({
  therapist,
}: {
  therapist: Therapist;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-row items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(55,110,244,0.1)]">
          {imgError || !therapist.avatarUrl ? (
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
            {therapist.credential ? `${therapist.credential} · ` : ""}
            {therapist.location.name}
          </span>
          <span className="truncate text-xs font-normal text-[#596475]">
            {therapist.email}
          </span>
        </div>
        {!therapist.isActive && (
          <span className="shrink-0 rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium uppercase text-[#596475]">
            Inactive
          </span>
        )}
      </div>

      <div className="flex justify-between">
        {[
          { value: therapist.activeClientCount, label: "Active" },
          { value: therapist.ytdSessions, label: "YTD" },
          { value: formatRevenueK(therapist.revenue), label: "Revenue" },
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

      {/*
        No utilization % — deliberately absent from GET /api/therapists since
        there's no capacity/schedule field to compute a genuine percentage
        against. PTO balance fills that slot instead of a fabricated number.
      */}
      <div className="flex items-center justify-between text-xs font-normal text-[#596475]">
        <span>PTO Balance</span>
        <span className="font-medium text-[#071123]">{therapist.ptoBalance}h</span>
      </div>
    </div>
  );
}
