"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import ModalSelectField from "@/src/sections/sessionsSections/ModalSelectField";
import ReminderToggle from "@/src/sections/followUpsSections/ReminderToggle";
import { clientsData } from "@/src/data/clientsData/clientsData";

// This modal's palette (labels #434655, shells #F8F9FF/#EFF4FF, focus
// #004AC6) is deliberately distinct from the Schedule Session modal's.
const LABEL_CLASS =
  "text-xs font-semibold leading-4 tracking-[0.6px] text-[#434655]";

export default function AddFollowUpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [client] = useState(clientsData[0].name);
  const [dueDate, setDueDate] = useState("25/06/2026");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);

  if (!open) return null;

  function handleCreate() {
    // TODO: create a real follow-up record once followUpsData is stateful
    // (same open thread as leadsData/sessionsData).
    console.log("New follow-up:", { client, dueDate, notes, reminder });
    onClose();
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[560px] flex-col rounded-2xl bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-6 pt-5">
          {/* Title inferred from the modal's purpose — the export's text layer
              was generically named, so the literal string wasn't captured. */}
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
          <ModalSelectField
            label="Client"
            value={client}
            labelClassName={LABEL_CLASS}
            shellClassName="h-12 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] focus:border-[#004AC6]"
            valueClassName="text-base font-normal leading-6 text-[#0B1C30]"
            chevronSize={16}
            chevronColor="#434655"
          />

          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Due date</span>
            <div className="relative">
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-12 w-full rounded-lg border border-[#C3C6D7] bg-[#EFF4FF] pl-4 pr-11 text-base font-normal leading-6 text-[#0B1C30] outline-none focus:border-[#004AC6]"
              />
              <Calendar
                size={16}
                stroke="#434655"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLASS}>Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical or administrative notes..."
              className="h-30 w-full resize-none rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] p-3 text-sm font-normal leading-5 text-[#0B1C30] outline-none placeholder:text-[#6B7280] focus:border-[#004AC6]"
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
            onClick={handleCreate}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold leading-4 tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
