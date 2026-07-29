"use client";

// SignupRequestRow — one table row for the Signup Requests page.
// Renders avatar + name, email, role (assigned pill once approved, an
// Approve button while pending), status badge, and a reject action with a
// two-step confirm dialog. Reject permanently deletes the user account —
// there is no soft "rejected" status in the API.

import { Trash2 } from "lucide-react";
import RolePill from "@/src/components/signupRequestsComponents/RolePill";
import StatusBadge from "@/src/components/signupRequestsComponents/StatusBadge";
import {
  type SignupRequest,
  AVATAR_PALETTE,
} from "@/src/data/signupRequestsData/signupRequestsData";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(index: number) {
  return AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

export default function SignupRequestRow({
  request,
  index,
  isLast,
  isConfirmingDelete,
  isDeleting,
  onApproveClick,
  onRejectClick,
  onConfirmReject,
  onCancelReject,
}: {
  request: SignupRequest;
  index: number;
  isLast: boolean;
  isConfirmingDelete: boolean;
  isDeleting: boolean;
  onApproveClick: (request: SignupRequest) => void;
  onRejectClick: (id: string) => void;
  onConfirmReject: () => void;
  onCancelReject: () => void;
}) {
  const avatar = getAvatarColor(index);
  const isPending = request.status === "pending";

  return (
    <>
      <div
        className={`grid grid-cols-[2fr_2fr_1.5fr_1fr_80px] items-center gap-4 px-6 py-4 ${
          !isLast ? "border-b border-[#F1F5F9]" : ""
        }`}
      >
        {/* Name + avatar */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            style={{ background: avatar.bg, color: avatar.text }}
          >
            {getInitials(request.user.name)}
          </div>
          <span className="truncate text-sm font-semibold text-[#334155]">
            {request.user.name}
          </span>
        </div>

        {/* Email */}
        <span className="truncate text-sm font-medium text-[#64748B]">
          {request.user.email}
        </span>

        {/* Role — assigned pill once approved, Approve action while pending */}
        <div>
          {request.requestedRole ? (
            <RolePill roleName={request.requestedRole.name} />
          ) : (
            <button
              type="button"
              onClick={() => onApproveClick(request)}
              className="cursor-pointer rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              Approve
            </button>
          )}
        </div>

        {/* Status badge — read-only */}
        <div>
          <StatusBadge status={request.status} />
        </div>

        {/* Actions — reject (pending only; an approved request is already
            reviewed, so DELETE would just 400) */}
        <div className="flex justify-center">
          {isPending && (
            <button
              type="button"
              aria-label={`Reject ${request.user.name}`}
              onClick={() => onRejectClick(request.id)}
              className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Inline confirm dialog — slides in below the row */}
      {isConfirmingDelete && (
        <div className="border-b border-[#F1F5F9] bg-[#FFF7ED] px-6 py-3">
          <p className="mb-2 text-sm font-medium text-[#92400E]">
            Reject this request? This will permanently delete this user&apos;s
            account. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelReject}
              disabled={isDeleting}
              className="cursor-pointer rounded-lg border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmReject}
              disabled={isDeleting}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Yes, reject & delete"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
