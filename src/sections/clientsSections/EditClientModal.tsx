"use client";

import { useState } from "react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";
import LocationSelect from "@/src/components/sharedComponents/LocationSelect";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import type { ClientStatus } from "@/src/data/clientsData/clientsData";
import type { Client, CreateClientPayload } from "@/src/services/clientsService";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, emailError, nameError } from "@/src/lib/validation";

const CLIENT_STATUS_OPTIONS: ClientStatus[] = [
  "Consultation Completed",
  "Therapy Session Booked",
  "Ongoing Therapy",
  "Completed Program",
];

export default function EditClientModal({
  client,
  onClose,
  onUpdate,
}: {
  client: Client;
  onClose: () => void;
  onUpdate: (clientId: string, payload: Partial<CreateClientPayload>) => Promise<Client>;
}) {
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [locationId, setLocationId] = useState(client.locationId);
  const [therapistId, setTherapistId] = useState(client.therapistId);
  const [status, setStatus] = useState<ClientStatus>(client.status);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameErr = nameError(name);
  const emailErr = emailError(email);
  const isFormValid =
    Boolean(name.trim()) && Boolean(email.trim()) && Boolean(locationId)
    && Boolean(therapistId) && !nameErr && !emailErr;

  async function handleSave() {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await onUpdate(client.id, {
        name,
        email,
        locationId,
        therapistId,
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-[#C3C6D7] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-[#C3C6D7] px-6 py-4">
          <h2 className="text-[22px] font-bold text-[#0F172A]">Edit Client</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-6">
          <FormField
            label="Full Name *"
            type="text"
            placeholder="Enter client name"
            maxLength={MAX_NAME_LENGTH}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameErr ?? undefined}
          />

          <FormField
            label="Email"
            type="email"
            placeholder="Enter email address"
            maxLength={MAX_EMAIL_LENGTH}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailErr ?? undefined}
          />

          <div className="flex gap-6">
            <LocationSelect value={locationId} onChange={setLocationId} />
            <TherapistSelect value={therapistId} onChange={setTherapistId} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">Status</span>
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setStatusMenuOpen((prev) => !prev)}
                className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] px-4 text-base text-[#0B1C30]"
              >
                <span className="truncate">{status}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="shrink-0 text-[#434655]">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {statusMenuOpen && (
                <StatusDropdownMenu
                  options={CLIENT_STATUS_OPTIONS}
                  selected={status}
                  onSelect={(value) => setStatus(value as ClientStatus)}
                  onClose={() => setStatusMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 rounded-b-2xl border-t border-[#C3C6D7] bg-[#F8F9FF] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold tracking-[0.6px] text-[#434655] transition-colors hover:bg-black/4"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isFormValid || isSubmitting}
            onClick={handleSave}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
