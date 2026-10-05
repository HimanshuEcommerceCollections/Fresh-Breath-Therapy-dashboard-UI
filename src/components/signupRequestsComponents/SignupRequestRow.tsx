"use client";

// SignupRequestRow — one table row for the Signup Requests page.
// Renders avatar + name, email, role (assigned pill plus a change-role
// action once approved, an Approve button while pending), status badge, and
// a remove action with a two-step confirm dialog. Removing — rejecting a
// pending request or revoking an approved one — permanently deletes the user
// account; there is no soft "rejected" status in the API.

import { Pencil, Trash2 } from "lucide-react";
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
  onChangeRoleClick,
  onRemoveClick,
  onConfirmRemove,
  onCancelRemove,
}: {
  request: SignupRequest;
  index: number;
  isLast: boolean;
  isConfirmingDelete: boolean;
  isDeleting: boolean;
  onApproveClick: (request: SignupRequest) => void;
  onChangeRoleClick: (request: SignupRequest) => void;
  onRemoveClick: (id: string) => void;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
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

        {/* Email, plus the linked therapist record when there is one */}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-[#64748B]">
            {request.user.email}
          </span>
          {request.linkedTherapist && (
            <span className="truncate text-[11px] text-[#94A3B8]">
              Therapist: {request.linkedTherapist.name}
              {request.linkedTherapist.isActive ? "" : " (inactive)"}
            </span>
          )}
        </div>

        {/* Role — assigned pill + change action once approved, Approve
            action while pending */}
        <div>
          {request.requestedRole ? (
            <div className="flex items-center gap-1.5">
              <RolePill roleName={request.requestedRole.name} />
              {!isPending && (
                <button
                  type="button"
                  aria-label={`Change role for ${request.user.name}`}
                  title="Change role"
                  onClick={() => onChangeRoleClick(request)}
                  className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                >
                  <Pencil size={14} strokeWidth={1.75} />
                </button>
              )}
            </div>
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

        {/* Actions — reject a pending request, or revoke an approved one */}
        <div className="flex justify-center">
          <button
            type="button"
            aria-label={`${isPending ? "Reject" : "Remove access for"} ${request.user.name}`}
            title={isPending ? "Reject request" : "Remove access"}
            onClick={() => onRemoveClick(request.id)}
            className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Inline confirm dialog — slides in below the row */}
      {isConfirmingDelete && (
        <div className="border-b border-[#F1F5F9] bg-[#FFF7ED] px-6 py-3">
          <p className="mb-2 text-sm font-medium text-[#92400E]">
            {isPending
              ? "Reject this request? This will permanently delete this user’s account."
              : "Remove this user’s access? Their approval is revoked and their account permanently deleted."}{" "}
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelRemove}
              disabled={isDeleting}
              className="cursor-pointer rounded-lg border border-[#E2E8F0] bg-white px-4 py-1.5 text-xs font-semibold text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmRemove}
              disabled={isDeleting}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : isPending ? "Yes, reject & delete" : "Yes, remove access"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
