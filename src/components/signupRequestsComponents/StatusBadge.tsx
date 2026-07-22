"use client";

// StatusBadge — colored pill with a 6px dot + label for Approved / Pending.

import {
  type SignupRequestStatus,
  statusStyleConfig,
} from "@/src/data/signupRequestsData/signupRequestsData";

export default function StatusBadge({ status }: { status: SignupRequestStatus }) {
  const style = statusStyleConfig[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-xs font-medium"
      style={{ background: style.bg, color: style.text }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: style.dot }}
      />
      {status}
    </span>
  );
}
