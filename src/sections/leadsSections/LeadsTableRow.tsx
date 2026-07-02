"use client";

import type { Lead } from "@/src/data/leadsData/leadsData";
import { LEADS_TABLE_GRID } from "@/src/sections/leadsSections/leadsTableGrid";
import StatusCombobox from "@/src/sections/leadsSections/StatusCombobox";

export default function LeadsTableRow({ lead }: { lead: Lead }) {
  return (
    <div
      className={`${LEADS_TABLE_GRID} border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="flex flex-col px-2 py-2.5">
        <span className="truncate text-sm font-medium text-[#071123]">
          {lead.name}
        </span>
        <span className="truncate text-xs font-normal text-[#596475]">
          {lead.age} · {lead.genderOrPronoun}
        </span>
      </div>

      <div className="flex flex-col px-2 py-2.5">
        <span className="truncate text-sm font-normal text-[#071123]">
          {lead.email}
        </span>
        <span className="truncate text-sm font-normal text-[#596475]">
          {lead.phone}
        </span>
      </div>

      <div className="truncate px-2 py-2.5 text-sm font-normal text-[#071123]">
        {lead.location}
      </div>

      <div className="truncate px-2 py-2.5 text-sm font-normal text-[#071123]">
        {lead.therapist}
      </div>

      <div className="truncate px-2 py-2.5 text-sm font-normal text-[#596475]">
        {lead.source}
      </div>

      <div className="px-2 py-2.5">
        <StatusCombobox status={lead.status} />
      </div>

      <div className="flex items-center justify-end px-2 py-2.5">
        <button
          type="button"
          aria-label={`Edit ${lead.name}`}
          onClick={() => {
            // TODO: open the edit-lead modal once it exists.
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#071123] transition-colors hover:bg-black/[0.04]"
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
              d="M14.1161 4.54029C14.4686 4.1879 14.6666 3.70993 14.6667 3.21152C14.6668 2.71311 14.4688 2.23509 14.1165 1.88262C13.7641 1.53015 13.2861 1.33209 12.7877 1.33203C12.2893 1.33197 11.8113 1.5299 11.4588 1.88229L2.56145 10.7816C2.40667 10.936 2.29219 11.126 2.22812 11.335L1.34745 14.2363C1.33022 14.2939 1.32892 14.3552 1.34369 14.4135C1.35845 14.4719 1.38873 14.5251 1.43132 14.5676C1.4739 14.6101 1.5272 14.6403 1.58556 14.655C1.64392 14.6697 1.70516 14.6683 1.76279 14.651L4.66479 13.771C4.87357 13.7075 5.06357 13.5937 5.21812 13.4396L14.1161 4.54029Z"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 3.33203L12.6667 5.9987"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Delete ${lead.name}`}
          onClick={() => {
            // TODO: open the delete confirmation once it exists.
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#F22A36] transition-colors hover:bg-black/[0.04]"
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
              d="M6.66675 7.33203V11.332"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33325 7.33203V11.332"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3334 14.6667H4.66671C4.31309 14.6667 3.97395 14.5262 3.7239 14.2761C3.47385 14.0261 3.33337 13.687 3.33337 13.3333V4"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 4H14"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.33325 3.9987V2.66536C5.33325 2.31174 5.47373 1.9726 5.72378 1.72256C5.97383 1.47251 6.31296 1.33203 6.66659 1.33203H9.33325C9.68687 1.33203 10.026 1.47251 10.2761 1.72256C10.5261 1.9726 10.6666 2.31174 10.6666 2.66536V3.9987"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
