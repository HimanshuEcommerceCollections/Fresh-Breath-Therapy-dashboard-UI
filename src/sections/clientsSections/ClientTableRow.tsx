"use client";

import type { Client } from "@/src/data/clientsData/clientsData";
import { CLIENTS_TABLE_GRID } from "@/src/sections/clientsSections/clientsTableGrid";
import StatusPill from "@/src/sections/clientsSections/StatusPill";

export default function ClientTableRow({ client }: { client: Client }) {
  return (
    <div
      className={`${CLIENTS_TABLE_GRID} min-h-13.5 border-b border-[#E0E5EB] px-4 last:border-b-0`}
    >
      <div className="flex flex-col px-2 py-2">
        <span className="truncate text-sm font-medium leading-5 tracking-[-0.154px] text-[#071123]">
          {client.name}
        </span>
        <span className="truncate text-xs font-normal leading-4 text-[#596475]">
          {client.email}
        </span>
      </div>

      <div className="truncate px-2 py-4 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        {client.therapist}
      </div>

      <div className="truncate px-2 py-4 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        {client.location}
      </div>

      <div className="px-2 py-4 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        {client.sessions}
      </div>

      <div className="px-2 py-4 text-sm font-normal leading-5 tracking-[-0.154px] text-[#071123]">
        ${client.lifetimeValue.toLocaleString()}
      </div>

      <div className="px-2 py-[15.5px]">
        <StatusPill status={client.status} />
      </div>

      <div className="flex justify-end px-2 py-2.5">
        {/* TODO: route to the client detail view once it exists (same open
            thread as the Leads row actions). */}
        <button
          type="button"
          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-xs font-medium leading-4 text-[#071123] transition-colors hover:bg-black/4"
        >
          Open
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M3.33325 8H12.6666"
              stroke="currentColor"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.66675 4L12.6667 8L8.66675 12"
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
