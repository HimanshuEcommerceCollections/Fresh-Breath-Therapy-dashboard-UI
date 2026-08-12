"use client";

// src/components/sessionsComponents/EditSessionModal.tsx
//
// Correcting a session already on the calendar. Before this, the only field
// an admin could change was the status dropdown in List view — a session
// booked at the wrong time, or against the wrong clinician, could only be
// fixed by deleting it and creating a replacement, which loses its history
// and its id.
//
// Every field is pre-filled from the session, so an admin fixing one thing
// isn't made to re-enter the other five.

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import { sessionTypeOptions } from "@/src/data/sessionsData/sessionTypeOptions";
import { statusOptionsData } from "@/src/data/sessionsData/statusOptionsData";
import type {
  Session,
  UpdateSessionPayload,
} from "@/src/services/sessionsService";
import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";

const LABEL = "text-sm font-semibold leading-5 text-[#0F172A]";
const FIELD =
  "h-13 w-full rounded-xl border border-[#E2E8F0] bg-[rgba(248,250,252,0.5)] px-4 text-base text-[#0B1C30] outline-none transition-colors focus:border-[#376EF4]";

export default function EditSessionModal({
  session,
  isSaving,
  onClose,
  onSave,
}: {
  session: Session;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: UpdateSessionPayload) => Promise<unknown>;
}) {
  const [clientId, setClientId] = useState(session.clientId);
  const [therapistId, setTherapistId] = useState(session.therapistId);
  const [date, setDate] = useState(session.date);
  // The API returns "HH:MM:SS"; <input type="time"> wants "HH:MM".
  const [time, setTime] = useState(session.time.slice(0, 5));
  const [type, setType] = useState(session.type);
  const [status, setStatus] = useState<SessionStatus>(session.status);

  const save = async () => {
    // Only what actually changed. Sending every field would make the
    // double-booking check re-run on an unchanged date/time and could reject
    // an edit that touches nothing about the schedule.
    const payload: UpdateSessionPayload = {};
    if (clientId !== session.clientId) payload.clientId = clientId;
    if (therapistId !== session.therapistId) payload.therapistId = therapistId;
    if (date !== session.date) payload.date = date;
    if (time !== session.time.slice(0, 5)) payload.time = time;
    if (type !== session.type) payload.type = type;
    if (status !== session.status) payload.status = status;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }
    await onSave(payload);
    onClose();
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="w-full max-w-140 rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_10px_30px_rgba(7,17,35,0.12)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E0E5EB] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.3px] text-[#071123]">
              Edit session
            </h2>
            <p className="mt-0.5 text-sm text-[#596475]">
              {session.client} · {session.date} at {session.time}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1 text-[#596475] transition-colors hover:bg-[#F7FBFD]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <ClientSelect label="Client" value={clientId} onChange={setClientId} />
          <TherapistSelect
            label="Therapist"
            placeholder="Select a therapist…"
            value={therapistId}
            onChange={setTherapistId}
            labelClassName={LABEL}
            shellClassName={FIELD}
          />

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL}>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={FIELD}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL}>Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={FIELD}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL}>Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`${FIELD} cursor-pointer`}
              >
                {sessionTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <span className={LABEL}>Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SessionStatus)}
                className={`${FIELD} cursor-pointer`}
              >
                {statusOptionsData.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#E0E5EB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E0E5EB] px-4 py-2 text-sm font-medium text-[#071123] transition-colors hover:bg-[#F7FBFD]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => void save()}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#376EF4] px-4 py-2 text-sm font-medium text-[#FCFCFC] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
