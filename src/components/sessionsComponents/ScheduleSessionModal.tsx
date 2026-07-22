"use client";

// src/components/sessionsComponents/ScheduleSessionModal.tsx
//
// Schedule Session modal — fully wired to useScheduleSessionForm (form state
// + validation + service stub). Reuses ModalOverlay from leadsSections.
// Client, Therapist, and Type fields are real interactive <select> elements;
// Date and Time are free-text inputs with icon decorations.

import { Calendar, Clock, User, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import { useScheduleSessionForm } from "@/src/hooks/useScheduleSessionForm";
import {
  clientOptions,
  therapistOptions,
} from "@/src/data/sessionsData/scheduleModalOptionsData";
import { sessionTypeOptions } from "@/src/data/sessionsData/sessionTypeOptions";

// Shared label style
const LABEL_CLASS = "text-sm font-semibold leading-5 text-[#0F172A]";
// Shared select shell style
const SELECT_CLASS =
  "h-13 w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] px-4 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]";

export default function ScheduleSessionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const form = useScheduleSessionForm(onClose);

  if (!open) return null;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[540px] flex-col rounded-2xl bg-[#FCFDFF] shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-[22px] font-bold leading-[33px] text-[#0F172A]">
            Schedule Session
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4 p-6">
          {/* Client */}
          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Client</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <User size={18} />
              </span>
              <select
                value={form.client}
                onChange={(e) => form.setClient(e.target.value)}
                className={`${SELECT_CLASS} pl-11 pr-11`}
              >
                <option value="" disabled>
                  Select a client…
                </option>
                {clientOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Therapist */}
          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Therapist</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                <User size={18} />
              </span>
              <select
                value={form.therapist}
                onChange={(e) => form.setTherapist(e.target.value)}
                className={`${SELECT_CLASS} pl-11 pr-11`}
              >
                <option value="" disabled>
                  Select a therapist…
                </option>
                {therapistOptions.map((t) => (
                  <option
                    key={t.name}
                    value={`${t.name} — ${t.location}`}
                  >
                    {t.name} — {t.location}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Date + Time side by side */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>Date</span>
              <div className="relative">
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => form.setDate(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] pl-4 pr-11 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]"
                />
                <Calendar
                  size={18}
                  stroke="#0F172A"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>Time</span>
              <div className="relative">
                <input
                  type="text"
                  value={form.time}
                  onChange={(e) => form.setTime(e.target.value)}
                  placeholder="h:mm AM/PM"
                  className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] pl-4 pr-11 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]"
                />
                <Clock
                  size={18}
                  stroke="#0F172A"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          {/* Type — styled select with checkmark-on-selected via custom panel */}
          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Type</span>
            <div className="relative">
              <select
                value={form.type}
                onChange={(e) => form.setType(e.target.value)}
                className={`${SELECT_CLASS} pr-11`}
              >
                <option value="" disabled>
                  Select session type…
                </option>
                {sessionTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={form.handleSubmit}
            disabled={!form.isValid || form.isSubmitting}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold leading-4 tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {form.isSubmitting ? "Scheduling…" : "Schedule"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
