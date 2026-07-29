"use client";

// ApproveRequestModal — role-select confirmation for approving a pending
// signup request. Options come from GET /api/settings/roles (via the
// useSignupRequests hook), not a hardcoded list, so a 4th role added on the
// backend shows up here automatically.

import { useState } from "react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import Select from "@/src/components/sharedComponents/Select";
import type { SignupRequest } from "@/src/data/signupRequestsData/signupRequestsData";
import type { SettingsRole } from "@/src/services/settingsService";

export default function ApproveRequestModal({
  request,
  roles,
  isApproving,
  onConfirm,
  onClose,
}: {
  request: SignupRequest;
  roles: SettingsRole[];
  isApproving: boolean;
  onConfirm: (roleId: string) => void;
  onClose: () => void;
}) {
  const [roleId, setRoleId] = useState("");
  const selectedRoleName = roles.find((r) => r.id === roleId)?.name ?? "";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-125 flex-col rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-1 p-6 pb-4">
          <h2 className="text-2xl font-bold text-[#1E293B]">Approve Signup Request</h2>
          <p className="text-[15px] text-[#64748B]">
            Choose a role for <span className="font-semibold">{request.user.name}</span>{" "}
            ({request.user.email}). They&apos;ll be granted access immediately.
          </p>
        </div>

        <div className="px-6">
          <Select
            label="Role"
            placeholder="Select role"
            options={roles.map((r) => r.name)}
            value={selectedRoleName}
            onChange={(name) => {
              const match = roles.find((r) => r.name === name);
              setRoleId(match?.id ?? "");
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isApproving}
            className="cursor-pointer rounded-xl border border-[#E2E8F0] px-6 py-2.5 text-sm font-bold text-[#334155] transition-colors hover:bg-black/4 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!roleId || isApproving}
            onClick={() => onConfirm(roleId)}
            className="cursor-pointer rounded-xl border border-[#0070D2] bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          >
            {isApproving ? "Approving…" : "Approve"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
