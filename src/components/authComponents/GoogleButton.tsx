// src/components/authComponents/GoogleButton.tsx
"use client";

import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

interface GoogleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const GoogleButton = ({ label, className = "", ...rest }: GoogleButtonProps) => {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 rounded-xl border border-[#D9E7F1] bg-white py-3.5 text-[15px] font-medium text-[#061C31] transition-colors hover:bg-[#F9FCFF] ${className}`}
      {...rest}
    >
      <Image src="/authpages/googleicon.png" alt="" width={18} height={18} />
      {label}
    </button>
  );
};

export default GoogleButton;