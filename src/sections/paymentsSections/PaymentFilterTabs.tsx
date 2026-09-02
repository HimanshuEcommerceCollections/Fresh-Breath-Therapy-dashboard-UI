"use client";

// Two rows of filter chips — status and method — combinable, both applied
// server-side so switching one refetches rather than filtering a partial list.
//
// One component for both because they are the same control with different
// options; the payments page renders it twice. It replaces
// PaymentStatusFilterTabs, which hardcoded the four derived invoice states.

export default function PaymentFilterTabs<T extends string>({
  label,
  options,
  active,
  onChange,
  dotClass,
}: {
  /** Shown before the chips, e.g. "Status". */
  label: string;
  options: T[];
  active: T | null;
  /** Called with null when "All" is chosen. */
  onChange: (next: T | null) => void;
  /** Optional per-option dot colour, keyed by option. */
  dotClass?: Record<T, string>;
}) {
  const base =
    "flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 text-sm font-medium transition-colors";
  const on = "border-[#376EF4] bg-[rgba(55,110,244,0.08)] text-[#1447E6]";
  const off = "border-[#E0E5EB] bg-white text-[#596475] hover:bg-[#F7FBFD]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-[0.6px] text-[#434655]">
        {label.toUpperCase()}
      </span>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${base} ${active === null ? on : off}`}
      >
        All
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(active === option ? null : option)}
          className={`${base} ${active === option ? on : off}`}
        >
          {dotClass && (
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass[option]}`} />
          )}
          {option}
        </button>
      ))}
    </div>
  );
}
