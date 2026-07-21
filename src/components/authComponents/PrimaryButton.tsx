// src/components/authComponents/PrimaryButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isLoading?: boolean;
}

const PrimaryButton = ({
  label,
  isLoading = false,
  className = "",
  disabled,
  ...rest
}: PrimaryButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`flex w-full items-center justify-center rounded-xl bg-[#2D5154] py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        label
      )}
    </button>
  );
};

export default PrimaryButton;