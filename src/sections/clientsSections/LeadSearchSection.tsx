"use client";

import { clientsData } from "@/src/data/clientsData/clientsData";
import type { Lead } from "@/src/data/leadsData/leadsData";
import LeadSearchInput from "@/src/components/clientsComponents/LeadSearchInput";
import LeadStatusBadge from "@/src/components/clientsComponents/LeadStatusBadge";
import { LEAD_SEARCH_TABLE_GRID } from "@/src/sections/clientsSections/leadSearchTableGrid";

const COLUMNS = ["Lead", "Therapist", "Location", "Status", ""];

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3.5 3.5L10.5 10.5" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
      <path d="M10.5 3.5L3.5 10.5" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LeadSearchSection({
  searchQuery,
  onSearchQueryChange,
  leads,
  onCancel,
  onAddLead,
  convertingLeadId,
  convertedLeadIds,
}: {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  leads: Lead[];
  onCancel: () => void;
  onAddLead: (leadId: string) => void;
  convertingLeadId: string | null;
  convertedLeadIds: Set<string>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-end justify-between pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
            Clients
          </h1>
          <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
            {clientsData.length} active clients across the practice
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-[#325A5E] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <CloseIcon />
          Cancel
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <LeadSearchInput value={searchQuery} onChange={onSearchQueryChange} />
        <p className="mt-4 text-center text-sm text-[#6B7280]">
          Search leads to add as a client — one click converts a lead into a client.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
        <div className={`${LEAD_SEARCH_TABLE_GRID} border-b border-[#E5E7EB] px-6`}>
          {COLUMNS.map((column, index) => (
            <div
              key={column || `col-${index}`}
              className="px-2 py-3 text-sm font-medium text-[#596475]"
            >
              {column}
            </div>
          ))}
        </div>
        <div>
          {leads.map((lead) => {
            const isConverting = convertingLeadId === lead.id;
            const isConverted = convertedLeadIds.has(lead.id);
            return (
              <div
                key={lead.id}
                className={`${LEAD_SEARCH_TABLE_GRID} border-b border-[#E5E7EB] px-6 last:border-b-0`}
              >
                <div className="flex flex-col px-2 py-3">
                  <span className="truncate text-sm font-medium text-[#111827]">
                    {lead.name}
                  </span>
                  <span className="truncate text-xs font-normal text-[#6B7280]">
                    {lead.email}
                  </span>
                  <span className="truncate text-xs font-normal text-[#6B7280]">
                    {lead.phone}
                  </span>
                </div>
                <div className="truncate px-2 py-3 text-sm font-normal text-[#111827]">
                  {lead.therapist}
                </div>
                <div className="truncate px-2 py-3 text-sm font-normal text-[#111827]">
                  {lead.location}
                </div>
                <div className="px-2 py-3">
                  <LeadStatusBadge status={lead.status} />
                </div>
                <div className="flex justify-end px-2 py-3">
                  <button
                    type="button"
                    disabled={isConverting || isConverted}
                    onClick={() => onAddLead(lead.id)}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-sm font-medium text-[#1E293B] transition-colors hover:bg-black/4 disabled:cursor-default disabled:opacity-60"
                  >
                    {isConverted ? (
                      <>
                        <CheckIcon />
                        Added
                      </>
                    ) : isConverting ? (
                      "Adding…"
                    ) : (
                      <>Add Lead →</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
          {leads.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-[#6B7280]">
              No leads match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
