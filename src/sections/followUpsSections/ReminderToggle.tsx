"use client";

// Generic controlled toggle switch — first switch in the app, kept
// Follow-Up-agnostic so Settings (etc.) can reuse it later.
export default function ReminderToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-[#2563EB]" : "bg-[#C3C6D7]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left] ${
          checked ? "left-[26px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
