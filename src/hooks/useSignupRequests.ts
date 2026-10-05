"use client";

// src/hooks/useSignupRequests.ts
//
// Manages the signup requests list plus the approve / change-role (shared
// role-select modal) and remove (confirm-delete) flows. These can fail for
// reasons the UI can't predict up front (missing Therapist record, another
// admin already reviewed the request in another tab, a linked therapist
// still active) — so every flow invalidates the list from the server
// afterward instead of optimistically mutating local state, which would
// drift from reality on any of those failures.
//
// Query key is ["role-requests"] (no status filter) for this page's full
// list — the Sidebar's pending-count badge (SidebarSignupRequestsItem) uses
// ["role-requests", "pending"], sharing the same prefix, so invalidating
// ["role-requests"] here also refreshes the Sidebar badge instantly.

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SignupRequest } from "@/src/data/signupRequestsData/signupRequestsData";
import {
  signupRequestsService,
  TherapistStillActiveError,
} from "@/src/services/signupRequestsService";
import { rolesService } from "@/src/services/settingsService";
import { showSuccessToast } from "@/src/lib/toast";

// "approve" assigns the first role to a pending request; "change" moves an
// already-approved account to a different one. Same modal, same role list.
export type RoleModalMode = "approve" | "change";

export function useSignupRequests() {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["role-requests"],
    queryFn: () => signupRequestsService.fetchSignupRequests(),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["settings", "roles"],
    queryFn: () => rolesService.fetchRoles(),
  });

  // Role modal — the request being approved / re-roled, or null when closed.
  const [roleTarget, setRoleTarget] = useState<{
    request: SignupRequest;
    mode: RoleModalMode;
  } | null>(null);

  // Remove flow — holds the ID to delete, or null when closed.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Set when the backend refuses to revoke an account because its linked
  // therapist is still active — drives the "request failed" popup.
  const [blockedRemoval, setBlockedRemoval] = useState<{
    message: string;
    therapistName: string;
  } | null>(null);

  const invalidateRoleRequests = () =>
    queryClient.invalidateQueries({ queryKey: ["role-requests"] });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Step 1: user clicks Approve / Change role → open role-select modal
  const handleApproveClick = (request: SignupRequest) =>
    setRoleTarget({ request, mode: "approve" });
  const handleChangeRoleClick = (request: SignupRequest) =>
    setRoleTarget({ request, mode: "change" });
  const handleCancelRole = () => setRoleTarget(null);

  // Step 2: user picks a role and confirms
  const roleMutation = useMutation({
    mutationFn: (roleId: string) => {
      if (!roleTarget) throw new Error("No request selected");
      return roleTarget.mode === "approve"
        ? signupRequestsService.approveRequest(roleTarget.request.id, roleId)
        : signupRequestsService.changeRole(roleTarget.request.id, roleId);
    },
    onSuccess: (updated) => {
      if (roleTarget?.mode === "change") {
        showSuccessToast(`${updated.user.name} is now ${updated.requestedRole?.name ?? "updated"}.`);
      }
    },
    onSettled: () => {
      // Refetch regardless of success/failure — errors (e.g. "No therapist
      // record found...", "Request already reviewed.") are surfaced
      // verbatim by the apiClient toast interceptor, and the list should
      // reflect whatever the server's real state ended up being either way.
      setRoleTarget(null);
      invalidateRoleRequests();
    },
  });

  // Step 1: user clicks trash → open confirm dialog
  const handleRemoveClick = (id: string) => setConfirmDeleteId(id);
  const handleCancelRemove = () => setConfirmDeleteId(null);

  // Step 2: user confirms → permanently deletes the user account
  const removeMutation = useMutation({
    mutationFn: (requestId: string) => signupRequestsService.removeRequest(requestId),
    onError: (error) => {
      if (error instanceof TherapistStillActiveError) {
        setBlockedRemoval({ message: error.message, therapistName: error.therapist.name });
      }
    },
    onSettled: () => {
      setConfirmDeleteId(null);
      invalidateRoleRequests();
    },
  });

  return {
    requests,
    roles,
    isLoading,
    pendingCount,
    // Approve / change-role flow
    roleTarget,
    isSavingRole: roleMutation.isPending,
    handleApproveClick,
    handleChangeRoleClick,
    handleConfirmRole: (roleId: string) => roleMutation.mutateAsync(roleId).catch(() => {}),
    handleCancelRole,
    // Reject / revoke flow
    confirmDeleteId,
    isDeleting: removeMutation.isPending,
    handleRemoveClick,
    handleConfirmRemove: () =>
      confirmDeleteId ? removeMutation.mutateAsync(confirmDeleteId).catch(() => {}) : undefined,
    handleCancelRemove,
    blockedRemoval,
    dismissBlockedRemoval: () => setBlockedRemoval(null),
  };
}
