"use client";

import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  /** Inline validation message shown below the input; also switches the
   * border to red so the error is visible without reading the text. */
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
        {label}
      </span>
      <input
        {...inputProps}
        className={`h-10 w-full min-w-0 rounded-lg border bg-[#F8F9FF] px-4 text-base text-[#0B1C30] outline-none placeholder:text-[#6B7280] focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-400/30" : "border-[#C3C6D7] focus:ring-[#325A5E]/30"
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
