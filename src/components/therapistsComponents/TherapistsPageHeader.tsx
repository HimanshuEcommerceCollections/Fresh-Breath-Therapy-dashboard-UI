"use client";

import { useState } from "react";
import type { AddTherapistPayload, Therapist } from "@/src/services/therapistsService";
import AddTherapistModal from "@/src/sections/therapistsSections/AddTherapistModal";

export default function TherapistsPageHeader({
  therapists,
  onCreate,
}: {
  therapists: Therapist[];
  onCreate: (payload: AddTherapistPayload) => Promise<Therapist>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const count = therapists.length;
  const clinicCount = new Set(therapists.map((t) => t.location.id)).size;

  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Therapists
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          {count} licensed therapists across {clinicCount} clinics
        </p>
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M8 3.33203V12.6654"
            stroke="#FCFCFC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.33325 8H12.6666"
            stroke="#FCFCFC"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add Therapist
      </button>

      {isModalOpen && (
        <AddTherapistModal
          onClose={() => setIsModalOpen(false)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}
