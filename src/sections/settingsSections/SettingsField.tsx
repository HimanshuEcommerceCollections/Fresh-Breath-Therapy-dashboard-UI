"use client";

// Labeled input row for the settings forms — a real controlled input even
// though the reference reads as static (no save action exists yet).
export default function SettingsField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium tracking-[-0.154px] text-[#071123]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-xl border border-[#E0E5EB] bg-white px-3 text-sm font-normal tracking-[-0.154px] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] outline-none focus:ring-2 focus:ring-[#376EF4]/30"
      />
    </label>
  );
}
