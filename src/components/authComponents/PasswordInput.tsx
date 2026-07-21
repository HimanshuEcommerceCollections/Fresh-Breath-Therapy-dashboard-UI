// src/components/authComponents/PasswordInput.tsx
"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
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
          <Lock
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#717879]"
            strokeWidth={1.8}
          />
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={`w-full rounded-xl border border-[#C1C8C8] bg-white py-3 pl-10 pr-11 text-[15px] text-[#141D1B] placeholder:text-[#6B7280] outline-none transition-colors focus:border-[#325A5E] focus:ring-1 focus:ring-[#325A5E]/30 ${
              error ? "border-red-400" : ""
            } ${className}`}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3.5 text-[#717879] hover:text-[#141D1B] transition-colors"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;