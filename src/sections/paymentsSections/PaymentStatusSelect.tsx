"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_ORDER,
  type PaymentStatus,
} from "@/src/services/enrollmentsService";

// Green paid / yellow partially paid / blue pending / red overdue.
const STYLES: Record<PaymentStatus, { pill: string; dot: string }> = {
  paid: { pill: "border-[#BBF7D0] bg-[#F0FDF4] text-[#16A34A]", dot: "bg-[#16A34A]" },
  partially_paid: { pill: "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]", dot: "bg-[#F2A618]" },
  pending: { pill: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]", dot: "bg-[#376EF4]" },
  overdue: { pill: "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]", dot: "bg-[#EF4444]" },
};

export default function PaymentStatusSelect({
  status,
  readOnly = false,
  onSelect,
}: {
  status: PaymentStatus;
  readOnly?: boolean;
  onSelect?: (next: PaymentStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen]);

  const style = STYLES[status];

  if (readOnly || !onSelect) {
    return (
      <span
        className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium ${style.pill}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {PAYMENT_STATUS_LABELS[status]}
      </span>
    );
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex h-8 w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 text-sm font-medium transition-opacity hover:opacity-90 ${style.pill}`}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
          <span className="truncate">{PAYMENT_STATUS_LABELS[status]}</span>
        </span>
        <ChevronDown size={14} className="shrink-0 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-1 w-52 overflow-hidden rounded-xl border border-[#E0E5EB] bg-white p-1 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
          {PAYMENT_STATUS_ORDER.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (option !== status) onSelect(option);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-[#071123] transition-colors hover:bg-[#F7FBFD]"
            >
              <span className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${STYLES[option].dot}`} />
                {PAYMENT_STATUS_LABELS[option]}
              </span>
              {option === status && <Check size={14} stroke="#376EF4" />}
            </button>
          ))}
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] leading-tight text-[#94A3B8]">
            Only Overdue is set manually — the others follow the amount paid.
          </p>
        </div>
      )}
    </div>
  );
}
