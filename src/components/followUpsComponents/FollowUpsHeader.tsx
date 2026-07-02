"use client";

import { Plus } from "lucide-react";

export default function FollowUpsHeader({
  onAddClick,
}: {
  onAddClick: () => void;
}) {
  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Follow-Ups
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          Stay on top of pending client communications
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="flex h-9 cursor-pointer items-center gap-3 rounded-xl bg-[#376EF4] px-4 text-sm font-medium leading-5 tracking-[-0.154px] text-[#FCFCFC] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
      >
        <Plus size={16} stroke="#FCFCFC" />
        Add Follow-Up
      </button>
    </div>
  );
}
