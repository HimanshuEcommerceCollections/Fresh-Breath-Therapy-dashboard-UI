// src/components/authComponents/OtpInputGroup.tsx
"use client";

import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

interface OtpInputGroupProps {
  length: number;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  disabled?: boolean;
}

const OtpInputGroup = ({
  length,
  values,
  onChange,
  error,
  disabled = false,
}: OtpInputGroupProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // focus the first empty box on mount
    const firstEmptyIndex = values.findIndex((v) => !v);
    inputRefs.current[firstEmptyIndex === -1 ? 0 : firstEmptyIndex]?.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setDigit = (index: number, digit: string) => {
    const next = [...values];
    next[index] = digit;
    onChange(next);
  };

  const handleChange = (index: number, rawValue: string) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1); // keep only last digit typed
    setDigit(index, digit);

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    onChange(next);

    const nextFocusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full justify-between gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={values[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`h-14 w-full max-w-[52px] rounded-lg border text-center text-lg font-semibold text-[#141D1B] outline-none transition-colors focus:border-[#143A3D] focus:ring-1 focus:ring-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60 ${
              error ? "border-red-400" : "border-[#C1C8C8]"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInputGroup;