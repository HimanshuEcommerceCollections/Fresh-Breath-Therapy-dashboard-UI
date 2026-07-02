"use client";

import { useState } from "react";
import { Calendar, Clock, User, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import ModalSelectField from "@/src/sections/sessionsSections/ModalSelectField";
import {
  clientOptions,
  therapistOptions,
  sessionTypeOptions,
} from "@/src/data/sessionsData/scheduleModalOptionsData";

export default function ScheduleSessionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Defaults mirror the reference: first roster entries + a static date/time.
  const [client] = useState(clientOptions[0]);
  const [therapist] = useState(
    `${therapistOptions[0].name} — ${therapistOptions[0].location}`,
  );
  const [date, setDate] = useState("25/06/2026");
  const [time, setTime] = useState("10:00 AM");
  const [type] = useState(sessionTypeOptions[0]);

  if (!open) return null;

  function handleSchedule() {
    // TODO: create a real session record once sessionsData is stateful
    // (same open thread as leadsData on the Leads page).
    console.log("Schedule session:", { client, therapist, date, time, type });
    onClose();
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[540px] flex-col rounded-2xl bg-[#FCFDFF] shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between px-6 pt-5">
          {/* Title inferred from the modal's purpose — the export's text layer
              was generically named, so the literal string wasn't captured. */}
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

        <div className="flex flex-col gap-4 p-6">
          <ModalSelectField
            label="Client"
            value={client}
            icon={<User size={18} />}
          />
          <ModalSelectField
            label="Therapist"
            value={therapist}
            icon={<User size={18} />}
          />

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-semibold leading-5 text-[#0F172A]">
                Date
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
              <span className="text-sm font-semibold leading-5 text-[#0F172A]">
                Time
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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

          <ModalSelectField label="Type" value={type} />
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            type="button"
            onClick={handleSchedule}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold leading-4 tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
          >
            Schedule
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
