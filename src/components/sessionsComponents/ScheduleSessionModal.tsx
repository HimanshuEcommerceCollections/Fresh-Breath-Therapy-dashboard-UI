"use client";

// src/components/sessionsComponents/ScheduleSessionModal.tsx
//
// Schedule Session modal — fully wired to useScheduleSessionForm (form state
// + validation + service). Reuses ModalOverlay from leadsSections.
// The subject (lead or client) and Therapist use shared searchable
// comboboxes; Type stays a native <select> because five options need no
// filtering.

import { X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import SubjectSelect, { type SubjectValue } from "@/src/components/sharedComponents/SubjectSelect";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import { useScheduleSessionForm } from "@/src/hooks/useScheduleSessionForm";
import { sessionTypeOptions } from "@/src/data/sessionsData/sessionTypeOptions";
import type { ScheduleSessionPayload } from "@/src/services/sessionsService";

// Shared label style
const LABEL_CLASS = "text-sm font-semibold leading-5 text-[#0F172A]";
// Shared select shell style
const SELECT_CLASS =
  "h-13 w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] px-4 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]";

const ChevronIcon = () => (
  <svg
    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M4.5 6.75L9 11.25L13.5 6.75"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ScheduleSessionModal({
  open,
  onClose,
  onSchedule,
  initialSubject = null,
  lockSubject = false,
  lockedSubjectName,
}: {
  open: boolean;
  onClose: () => void;
  onSchedule: (payload: ScheduleSessionPayload) => Promise<void>;
  /** Pre-selects the person, for "schedule a session for them" straight after
   *  adding a lead or client. */
  initialSubject?: SubjectValue;
  /** Renders the subject read-only. Used with initialSubject when the modal
   *  was opened for one specific person. */
  lockSubject?: boolean;
  lockedSubjectName?: string;
}) {
  const form = useScheduleSessionForm(onSchedule, onClose, initialSubject);

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
          {/* Lead or client — one picker with a toggle, defaulting to
              clients. Only the selected side is fetched. */}
          <SubjectSelect
            label="Client or lead"
            value={form.subject}
            onChange={form.setSubject}
            locked={lockSubject}
            lockedName={lockedSubjectName}
          />

          {/* Therapist — the shared searchable combobox, not a native
              <select>. With 150 therapists on file the native list rendered as
              an unscoped wall of names taller than the modal itself, with no
              way to filter it. */}
          <TherapistSelect
            label="Therapist"
            placeholder="Select a therapist…"
            value={form.therapistId}
            onChange={form.setTherapistId}
            labelClassName={LABEL_CLASS}
            shellClassName={SELECT_CLASS}
          />

          {/* Date + Time side by side */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => form.setDate(e.target.value)}
                className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] px-4 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>Time</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => form.setTime(e.target.value)}
                className="h-13 w-full rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] px-4 text-base font-normal leading-6 text-[#0F172A] outline-none focus:border-2 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Type */}
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
              <ChevronIcon />
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
