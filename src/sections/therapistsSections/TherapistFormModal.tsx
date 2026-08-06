"use client";

import { useRef } from "react";
import Image from "next/image";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import Select from "@/src/components/sharedComponents/Select";
import LocationSelect from "@/src/components/sharedComponents/LocationSelect";
import { useTherapistForm } from "@/src/hooks/useTherapistForm";
import { employmentStatusOptions } from "@/src/data/therapistsData/therapistFormOptions";
import type {
  AddTherapistPayload,
  Therapist,
  UpdateTherapistPayload,
} from "@/src/services/therapistsService";

const INPUT_CLASS =
  "rounded-lg border border-[#E2E8F0] py-3 pl-4 pr-4 text-base text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB]/30";
const LABEL_CLASS = "text-sm font-bold text-[#1E293B]";

// One form for both Add and Edit — passing `therapist` switches it to edit
// mode. Keeping them as a single component means a field added here can't go
// missing from one of the two flows.
export default function TherapistFormModal({
  therapist,
  onClose,
  onCreate,
  onUpdate,
}: {
  therapist?: Therapist;
  onClose: () => void;
  onCreate?: (payload: AddTherapistPayload) => Promise<Therapist>;
  onUpdate?: (id: string, payload: UpdateTherapistPayload) => Promise<Therapist>;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useTherapistForm({ therapist, onCreate, onUpdate, onSuccess: onClose });

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex max-h-[92vh] w-150 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="text-2xl font-bold text-[#1E293B]">
              {form.isEdit ? "Edit Therapist" : "Add New Therapist"}
            </h2>
            <p className="text-[15px] text-[#64748B]">
              {form.isEdit
                ? "Update the therapist's details. Changes appear in the directory immediately."
                : "Enter the therapist's details. They'll appear in the directory immediately."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="shrink-0 cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex min-w-0 flex-col gap-6 overflow-y-auto px-6 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-2xl text-[#94A3B8]">
              {form.avatarUrl ? (
                <Image
                  src={form.avatarUrl}
                  alt=""
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                "?"
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) form.handleAvatarUpload(file);
                }}
              />
              <button
                type="button"
                disabled={form.isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-black/4 disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 11.333V12.667C2 13.02 2.14 13.359 2.39 13.61C2.64 13.86 2.98 14 3.33 14H12.67C13.02 14 13.36 13.86 13.61 13.61C13.86 13.359 14 13.02 14 12.667V11.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.333 5.333L8 2L4.667 5.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 2V10" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {form.isUploadingAvatar
                  ? "Uploading…"
                  : form.avatarUrl
                    ? "Replace photo"
                    : "Upload photo"}
              </button>
              <span className="text-xs text-[#94A3B8]">PNG or JPG · up to 5MB</span>
            </div>
          </div>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className={LABEL_CLASS}>Full Name</span>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => form.setFullName(e.target.value)}
              placeholder="Jane Doe"
              className={INPUT_CLASS}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5">
            <span className={LABEL_CLASS}>Email Address</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => form.setEmail(e.target.value)}
              placeholder="jane@freshbreath.co"
              className={INPUT_CLASS}
            />
          </label>
          {form.isEdit && (
            <p className="-mt-4 text-xs text-[#94A3B8]">
              Changing the email affects how a Therapist login is matched to
              this record on approval.
            </p>
          )}

          <div className="flex min-w-0 gap-6">
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>License / Credentials</span>
              <input
                type="text"
                value={form.credential}
                onChange={(e) => form.setCredential(e.target.value)}
                placeholder="LCSW"
                className={INPUT_CLASS}
              />
            </label>
            <label className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={LABEL_CLASS}>Specialization</span>
              <input
                type="text"
                value={form.specialization}
                onChange={(e) => form.setSpecialization(e.target.value)}
                placeholder="Anxiety, CBT"
                className={INPUT_CLASS}
              />
            </label>
          </div>

          <div className="flex min-w-0 gap-6">
            <div className="flex min-w-0 flex-1 flex-col">
              <LocationSelect
                label="Assigned Clinic"
                placeholder="Select clinic"
                value={form.locationId}
                onChange={form.setLocationId}
                labelClassName={LABEL_CLASS}
                shellClassName="h-auto rounded-lg border border-[#E2E8F0] py-3"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <Select
                label="Employment Status"
                placeholder="Select status"
                options={employmentStatusOptions}
                value={form.employmentStatus}
                onChange={form.setEmploymentStatus}
              />
            </div>
          </div>

          {/* Edit only: creating a therapist always starts them active, and
              this is how one is retired without deleting their history. */}
          {form.isEdit && (
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              <input
                type="checkbox"
                checked={!form.isActive}
                onChange={(e) => form.setIsActive(!e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-[#2563EB]"
              />
              <span className="flex flex-col">
                <span className="text-sm font-bold text-[#1E293B]">
                  Mark as inactive
                </span>
                <span className="text-xs text-[#64748B]">
                  Keeps all their sessions, clients and revenue history, but
                  flags them as no longer practising here.
                </span>
              </span>
            </label>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#E2E8F0] px-6 py-2.5 text-sm font-bold text-[#334155] transition-colors hover:bg-black/4"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!form.isValid || form.isSubmitting}
            onClick={form.handleSubmit}
            className="cursor-pointer rounded-xl border border-[#0070D2] bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {form.isSubmitting
              ? form.isEdit
                ? "Saving…"
                : "Adding…"
              : form.isEdit
                ? "Save Changes"
                : "Add Therapist"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
