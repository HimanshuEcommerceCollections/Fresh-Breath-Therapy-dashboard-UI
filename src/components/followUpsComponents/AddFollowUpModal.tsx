"use client";

import { useState } from "react";
import { X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import ClientSelect from "@/src/components/sharedComponents/ClientSelect";
import ReminderToggle from "@/src/sections/followUpsSections/ReminderToggle";
import type { CreateFollowUpPayload } from "@/src/services/followUpsService";

// This modal's palette (labels #434655, shells #F8F9FF/#EFF4FF, focus
// #004AC6) is deliberately distinct from the Schedule Session modal's.
// Mirrors MAX_NOTES_LENGTH in app/schemas/follow_up.py. The API rejects longer
// independently — this is so the admin is stopped while typing rather than by
// a 422 after pressing Create.
const MAX_NOTES_LENGTH = 40;

const LABEL_CLASS =
  "text-xs font-semibold leading-4 tracking-[0.6px] text-[#434655]";

export default function AddFollowUpModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateFollowUpPayload) => Promise<void>;
}) {
  const [clientId, setClientId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  async function handleCreate() {
    if (!clientId || !dueDate) return;

    setIsSubmitting(true);
    try {
      await onCreate({ clientId, dueDate, notes: notes || undefined, reminder });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[560px] flex-col rounded-2xl bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-xl font-semibold leading-7 text-[#0B1C30]">
            New follow-up
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#434655] transition-colors hover:text-[#0B1C30]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* Client — shared combobox, follow-up palette */}
          <ClientSelect
            label="Client"
            value={clientId}
            onChange={setClientId}
            labelClassName={LABEL_CLASS}
            shellClassName="h-12 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] focus:border-[#004AC6]"
          />

          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#EFF4FF] px-4 text-base font-normal leading-6 text-[#0B1C30] outline-none focus:border-[#004AC6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className={LABEL_CLASS}>Notes</span>
              {/* Shown always, not only when full: a counter that appears at the
                  limit reads as an error, whereas one that is always there is
                  just the rule. maxLength stops the typing; the API enforces
                  the same 40 independently. */}
              <span
                className={`text-xs ${
                  notes.length >= MAX_NOTES_LENGTH
                    ? "font-medium text-[#9A611D]"
                    : "text-[#6B7280]"
                }`}
              >
                {notes.length}/{MAX_NOTES_LENGTH}
              </span>
            </div>
            <textarea
              value={notes}
              maxLength={MAX_NOTES_LENGTH}
              onChange={(e) => setNotes(e.target.value.slice(0, MAX_NOTES_LENGTH))}
              placeholder="Short reminder, e.g. call about rescheduling"
              className="h-20 w-full resize-none rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] p-3 text-sm font-normal leading-5 text-[#0B1C30] outline-none placeholder:text-[#6B7280] focus:border-[#004AC6]"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold leading-7 text-[#0B1C30]">
              Reminder
            </span>
            <ReminderToggle checked={reminder} onChange={setReminder} />
          </div>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            disabled={!clientId || isSubmitting}
            onClick={handleCreate}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold leading-4 tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSubmitting ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
