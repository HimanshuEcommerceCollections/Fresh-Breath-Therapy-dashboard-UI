"use client";

// src/components/sharedComponents/NoteField.tsx
//
// The admin's note input, shared by the lead and client forms. One definition
// so the two cannot drift on the character cap, the hint text or the styling —
// a lead's note becomes the client's note on conversion, so they are the same
// field at two points in the same person's life.
//
// A textarea rather than an input because it reads as prose, but capped at
// MAX_NOTE_LENGTH: it is surfaced in a hover card on the tables, and a
// paragraph does not fit there. Longer context belongs in a follow-up, which
// carries a due date.

import { MAX_NOTE_LENGTH } from "@/src/lib/validation";

export default function NoteField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const isAtLimit = value.length >= MAX_NOTE_LENGTH;

  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="flex items-center justify-between text-xs font-semibold tracking-[0.6px] text-[#434655]">
        <span>Note</span>
        {/* Amber rather than red at the cap: the input stops accepting
            characters, so nothing is wrong — the user just needs to know why
            typing stopped. */}
        <span className={isAtLimit ? "text-[#B45309]" : "text-[#6B7280]"}>
          {value.length}/{MAX_NOTE_LENGTH}
        </span>
      </span>
      <textarea
        rows={2}
        maxLength={MAX_NOTE_LENGTH}
        placeholder="Anything the team should know — e.g. prefers mornings, insurance pending"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 resize-none rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] px-4 py-2.5 text-base leading-6 text-[#0B1C30] outline-none placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#325A5E]/30"
      />
      <span className="text-xs font-normal text-[#6B7280]">
        Shown when you hover this person&apos;s name in the table.
      </span>
    </label>
  );
}
