"use client";

// Labeled row + 36×20 toggle switch, shared by the Automation, Notifications,
// SaaS, and Security tabs. (Deliberately distinct from the Follow-Up modal's
// larger 48×24 ReminderToggle — different size/color spec.)
export default function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm font-normal text-[#071123]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#376EF4]" : "bg-[#E0E5EB]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#F7FBFD] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-[left] duration-200 ${
            enabled ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
