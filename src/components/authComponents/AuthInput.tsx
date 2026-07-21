// src/components/authComponents/AuthInput.tsx
"use client";

import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, id, className = "", ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-[#141D1B]"
        >
          {label}
        </label>

        <div className="relative flex w-full items-center">
          <Icon
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#717879]"
            strokeWidth={1.8}
          />
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border border-[#C1C8C8] bg-white py-3 pl-10 pr-4 text-[15px] text-[#141D1B] placeholder:text-[#6B7280] outline-none transition-colors focus:border-[#325A5E] focus:ring-1 focus:ring-[#325A5E]/30 ${
              error ? "border-red-400" : ""
            } ${className}`}
            {...rest}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;