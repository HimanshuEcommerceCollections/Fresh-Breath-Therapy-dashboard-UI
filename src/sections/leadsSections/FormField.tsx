"use client";

import type { InputHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ label, ...inputProps }: FormFieldProps) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
        {label}
      </span>
      <input
        {...inputProps}
        className="h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] px-4 text-base text-[#0B1C30] outline-none placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#325A5E]/30"
      />
    </label>
  );
}
