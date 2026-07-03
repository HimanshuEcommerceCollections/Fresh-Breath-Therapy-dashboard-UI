"use client";

import type { ReactNode } from "react";

export default function ReportTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-7 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-colors ${
        active
          ? "bg-[#F7FBFD] text-[#071123] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
          : "text-[#596475]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
