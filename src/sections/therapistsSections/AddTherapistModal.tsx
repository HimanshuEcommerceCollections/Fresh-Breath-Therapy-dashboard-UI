"use client";

import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import Select from "@/src/components/sharedComponents/Select";
import { useAddTherapistForm } from "@/src/hooks/useAddTherapistForm";
import {
  clinicOptions,
  employmentStatusOptions,
} from "@/src/data/therapistsData/therapistFormOptions";

export default function AddTherapistModal({ onClose }: { onClose: () => void }) {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    credential,
    setCredential,
    specialization,
    setSpecialization,
    clinic,
    setClinic,
    employmentStatus,
    setEmploymentStatus,
    isValid,
    isSubmitting,
    handleSubmit,
  } = useAddTherapistForm(onClose);

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-150 flex-col rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-[#1E293B]">Add New Therapist</h2>
            <p className="text-[15px] text-[#64748B]">
              Enter the therapist&apos;s details. They&apos;ll appear in the directory
              immediately.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F1F5F9] text-2xl text-[#94A3B8]">
              ?
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm font-semibold text-[#334155] transition-colors hover:bg-black/4"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 11.333V12.667C2 13.02 2.14 13.359 2.39 13.61C2.64 13.86 2.98 14 3.33 14H12.67C13.02 14 13.36 13.86 13.61 13.61C13.86 13.359 14 13.02 14 12.667V11.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.333 5.333L8 2L4.667 5.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 2V10" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload photo
              </button>
              <span className="text-xs text-[#94A3B8]">PNG or JPG · up to 5MB</span>
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[#1E293B]">Full Name</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="rounded-lg border border-[#E2E8F0] py-3 pl-4 pr-4 text-base text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB]/30"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-[#1E293B]">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@freshbreath.co"
              className="rounded-lg border border-[#E2E8F0] py-3 pl-4 pr-4 text-base text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB]/30"
            />
          </label>

          <div className="flex gap-6">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-bold text-[#1E293B]">License / Credentials</span>
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="LCSW"
                className="rounded-lg border border-[#E2E8F0] py-3 pl-4 pr-4 text-base text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB]/30"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-sm font-bold text-[#1E293B]">Specialization</span>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Anxiety, CBT"
                className="rounded-lg border border-[#E2E8F0] py-3 pl-4 pr-4 text-base text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#2563EB]/30"
              />
            </label>
          </div>

          <div className="flex gap-6">
            <Select
              label="Assigned Clinic"
              placeholder="Select clinic"
              options={clinicOptions}
              value={clinic}
              onChange={setClinic}
            />
            <Select
              label="Employment Status"
              placeholder="Select status"
              options={employmentStatusOptions}
              value={employmentStatus}
              onChange={setEmploymentStatus}
            />
          </div>
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
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl border border-[#0070D2] bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isSubmitting ? "Adding…" : "Add Therapist"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
