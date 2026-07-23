"use client";

import { useState } from "react";
import Image from "next/image";
import type { Therapist } from "@/src/services/therapistsService";

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

      {/*
        MISMATCH (flagged, not guessed): GET /api/therapists doesn't return
        activeClients/sessionsThisMonth/revenueThisMonth/utilizationPercent/
        ytdSessions/ptoHours — those aren't documented as available from this
        endpoint (they'd come from Dashboard/PTO/Reports aggregation instead).
        Rather than fabricate zeros, this card no longer renders that section.
      */}
    </div>
  );
}
