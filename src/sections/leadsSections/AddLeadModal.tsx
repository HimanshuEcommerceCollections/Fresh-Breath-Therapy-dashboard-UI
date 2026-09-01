"use client";

import { useState } from "react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import type { ContactStatus } from "@/src/data/leadsData/contactStatus";
import type { CreateLeadPayload, Lead } from "@/src/services/leadsService";
import { contactStatusOptions } from "@/src/data/leadsData/contactStatus";
import { referralSourceOptions } from "@/src/data/leadsData/referralSourceOptions";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import LocationSelect from "@/src/components/sharedComponents/LocationSelect";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import NoteField from "@/src/components/sharedComponents/NoteField";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";
import { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, emailError, nameError } from "@/src/lib/validation";

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
// Mirrors the backend's LeadCreate/LeadUpdate phone validation (schemas/lead.py) —
// keep these in sync so the frontend blocks the same input the API would reject.
const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/;
const MAX_AGE = 120;

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 19V17.5C16 15.8431 14.6569 14.5 13 14.5H9C7.34315 14.5 6 15.8431 6 17.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 11V13C4 13.5523 4.44772 14 5 14H6L8 19H10L8.5 14H12L18 18V6L12 10H5C4.44772 10 4 10.4477 4 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 10.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AddLeadModal({
  onClose,
  onCreate,
  lead = null,
  onUpdate,
}: {
  onClose: () => void;
  onCreate: (payload: CreateLeadPayload) => Promise<Lead>;
  /** When provided, the modal opens in edit mode: prefilled from this lead,
   * "Edit Lead" heading, and submits via `onUpdate` instead of `onCreate`. */
  lead?: Lead | null;
  onUpdate?: (leadId: string, payload: Partial<CreateLeadPayload>) => Promise<Lead>;
}) {
  const isEditMode = lead !== null;

  const [fullName, setFullName] = useState(lead?.name ?? "");
  const [age, setAge] = useState(lead?.age != null ? String(lead.age) : "");
  const [gender, setGender] = useState(lead?.genderOrPronoun ?? "");
  const [email, setEmail] = useState(lead?.email ?? "");
  const [phone, setPhone] = useState(lead?.phone ?? "");
  const [locationId, setLocationId] = useState(lead?.locationId ?? "");
  const [source, setSource] = useState(lead?.source ?? "");
  const [therapistId, setTherapistId] = useState(lead?.therapistId ?? "");
  const [note, setNote] = useState(lead?.note ?? "");
  const [status, setStatus] = useState<ContactStatus>(lead?.status ?? "New Lead");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = PHONE_PATTERN.test(phone.trim());
  const isAgeValid = age.trim().length === 0 || (Number(age) >= 0 && Number(age) <= MAX_AGE);
  const nameErr = nameError(fullName);
  const emailErr = emailError(email);
  const isFormValid =
    Boolean(fullName.trim()) && Boolean(locationId) && isPhoneValid && isAgeValid
    && !nameErr && !emailErr;

  async function handleAddLead() {
    if (!isFormValid) return;

    const payload = {
      name: fullName,
      age: age ? Number(age) : undefined,
      genderOrPronoun: gender || undefined,
      email,
      phone,
      locationId,
      // Empty string means "nothing selected" — must become undefined so it's
      // omitted from the request instead of being sent as an invalid UUID.
      therapistId: therapistId || undefined,
      source: source || undefined,
      // null, not undefined: this modal doubles as Edit Lead, and undefined
      // would be dropped from the PATCH body, silently leaving the old note in
      // place when the admin has just emptied the box.
      note: note.trim() || null,
      status,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode && onUpdate) {
        await onUpdate(lead.id, payload);
      } else {
        await onCreate(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-2xl flex-col rounded-2xl border border-[#C3C6D7] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between border-b border-[#C3C6D7] px-6 py-4">
          <h2 className="text-[22px] font-bold text-[#0F172A]">
            {isEditMode ? "Edit Lead" : "New Lead"}
          </h2>
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
          {/* Website-form detail, only present on leads that arrived via the
              lead webhook. Read-only: it's what the client actually submitted,
              not something an admin should rewrite. */}
          {isEditMode &&
            (lead.message || lead.preferredDatetime || lead.customerId ||
              lead.paymentStatus || lead.visitStatus) && (
            <div className="flex flex-col gap-2 rounded-xl border border-[#C3C6D7] bg-[#F8F9FF] p-4">
              <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                FROM THE WEBSITE FORM
              </span>
              {lead.customerId && (
                <p className="text-sm text-[#0B1C30]">
                  <span className="text-[#6B7280]">Customer ID: </span>
                  {lead.customerId}
                </p>
              )}
              {lead.preferredDatetime && (
                <p className="text-sm text-[#0B1C30]">
                  <span className="text-[#6B7280]">Preferred date &amp; time: </span>
                  {lead.preferredDatetime}
                </p>
              )}
              {(lead.paymentStatus || lead.visitStatus) && (
                <p className="text-sm text-[#0B1C30]">
                  {lead.paymentStatus && (
                    <>
                      <span className="text-[#6B7280]">Payment status: </span>
                      {lead.paymentStatus}
                    </>
                  )}
                  {lead.paymentStatus && lead.visitStatus && "  ·  "}
                  {lead.visitStatus && (
                    <>
                      <span className="text-[#6B7280]">Visit status: </span>
                      {lead.visitStatus}
                    </>
                  )}
                </p>
              )}
              {lead.message && (
                <p className="whitespace-pre-wrap text-sm text-[#0B1C30]">
                  <span className="text-[#6B7280]">Message: </span>
                  {lead.message}
                </p>
              )}
              <p className="text-xs text-[#6B7280]">
                {lead.consentGiven
                  ? "Consented to the privacy policy and HIPAA notice on submission."
                  : "No consent recorded on submission."}
              </p>
            </div>
          )}

          <FormField
            label="Full Name *"
            type="text"
            placeholder="Enter patient name"
            maxLength={MAX_NAME_LENGTH}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={nameErr ?? undefined}
          />

          <div className="flex gap-6">
            <FormField
              label="Age"
              type="number"
              placeholder="Enter age"
              min={0}
              max={MAX_AGE}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={!isAgeValid ? `Age must be between 0 and ${MAX_AGE}.` : undefined}
            />
            <FormSelect
              label="Gender"
              icon={<PersonIcon />}
              placeholder="Select gender"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={setGender}
            />
          </div>

          <div className="flex gap-6">
            <FormField
              label="Email"
              type="email"
              placeholder="Enter email address"
              maxLength={MAX_EMAIL_LENGTH}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailErr ?? undefined}
            />
            <FormField
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              maxLength={20}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={
                phone.trim().length > 0 && !isPhoneValid
                  ? "Enter 7-20 digits (spaces, +, -, and () are okay)."
                  : undefined
              }
            />
          </div>

          <div className="flex gap-6">
            <LocationSelect value={locationId} onChange={setLocationId} />
            <FormSelect
              label="Referral Source"
              icon={<MegaphoneIcon />}
              placeholder="Select referral source"
              options={referralSourceOptions}
              value={source}
              onChange={setSource}
            />
          </div>

          <div className="flex gap-6">
            <TherapistSelect value={therapistId} onChange={setTherapistId} />
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                Status
              </span>
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
                    options={contactStatusOptions}
                    selected={status}
                    onSelect={(value) => setStatus(value as ContactStatus)}
                    onClose={() => setStatusMenuOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
          <NoteField value={note} onChange={setNote} />
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
            onClick={handleAddLead}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSubmitting
              ? isEditMode
                ? "Saving…"
                : "Adding…"
              : isEditMode
                ? "Save Changes"
                : "Add Lead"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
