"use client";

import { useEffect, useState } from "react";
import { leadsData, type Lead, type LeadStatus } from "@/src/data/leadsData/leadsData";
import { leadStatusOptions } from "@/src/data/leadsData/leadStatusOptions";
import { locationOptions } from "@/src/data/leadsData/locationOptions";
import FormField from "@/src/sections/leadsSections/FormField";
import FormSelect from "@/src/sections/leadsSections/FormSelect";
import StatusDropdownMenu from "@/src/sections/leadsSections/StatusDropdownMenu";

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

// Sources and therapists are derived from the existing leads dataset so the
// modal stays in sync with the table's values — both will come from their own
// backend endpoints later.
const SOURCE_OPTIONS = Array.from(new Set(leadsData.map((l) => l.source)));
const THERAPIST_OPTIONS = Array.from(new Set(leadsData.map((l) => l.therapist)));

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 19V17.5C16 15.8431 14.6569 14.5 13 14.5H9C7.34315 14.5 6 15.8431 6 17.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 10C19 14.5 12 20 12 20C12 20 5 14.5 5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
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

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20C5 16.6863 8.13401 14.5 12 14.5C15.866 14.5 19 16.6863 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [therapist, setTherapist] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New Lead");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleAddLead() {
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: fullName,
      age: Number(age) || 0,
      genderOrPronoun: gender,
      email,
      phone,
      location,
      therapist,
      source,
      status,
    };
    // TODO: wire this into leadsData state once the list is stateful
    // (requires lifting leadsData into React state at the page level).
    console.log("New lead:", newLead);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(15,23,42,0.5)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-2xl flex-col rounded-2xl border border-[#C3C6D7] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#C3C6D7] px-6 py-4">
          <h2 className="text-[22px] font-bold text-[#0F172A]">New Lead</h2>
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
            placeholder="Enter patient name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="flex gap-6">
            <FormField
              label="Age"
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex gap-6">
            <FormSelect
              label="Location"
              icon={<PinIcon />}
              placeholder="Select location"
              options={locationOptions}
              value={location}
              onChange={setLocation}
            />
            <FormSelect
              label="Referral Source"
              icon={<MegaphoneIcon />}
              placeholder="Select referral source"
              options={SOURCE_OPTIONS}
              value={source}
              onChange={setSource}
            />
          </div>

          <div className="flex gap-6">
            <FormSelect
              label="Assigned Therapist"
              icon={<UserIcon />}
              placeholder="Select therapist"
              options={THERAPIST_OPTIONS}
              value={therapist}
              onChange={setTherapist}
            />
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
                    options={leadStatusOptions}
                    selected={status}
                    onSelect={(value) => setStatus(value as LeadStatus)}
                    onClose={() => setStatusMenuOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 rounded-b-2xl border-t border-[#C3C6D7] bg-[#F8F9FF] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold tracking-[0.6px] text-[#434655] transition-colors hover:bg-black/[0.04]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddLead}
            className="cursor-pointer rounded-lg bg-[#325A5E] px-8 py-2.5 text-xs font-semibold tracking-[0.6px] text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}
