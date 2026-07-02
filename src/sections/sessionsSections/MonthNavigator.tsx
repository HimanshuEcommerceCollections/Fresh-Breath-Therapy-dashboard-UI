"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthNavigator({
  label,
  onPrev,
  onNext,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex h-[70px] items-center justify-between rounded-[18px] border border-[#E0E5EB] bg-white px-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <button
        type="button"
        aria-label="Previous month"
        onClick={onPrev}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-black/4"
      >
        <ChevronLeft size={16} stroke="#071123" strokeWidth={1.5} />
      </button>
      <span className="text-sm font-semibold leading-5 text-[#071123]">
        {label}
      </span>
      <button
        type="button"
        aria-label="Next month"
        onClick={onNext}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-black/4"
      >
        <ChevronRight size={16} stroke="#071123" strokeWidth={1.5} />
      </button>
    </div>
  );
}
