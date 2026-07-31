"use client";

// src/hooks/useSignupRequests.ts
//
// Manages the signup requests list plus the approve (role-select modal) and
// reject (confirm-delete) flows. Approvals/rejections can fail for reasons
// the UI can't predict up front (missing Therapist record, another admin
// already reviewed the request in another tab) — so both flows invalidate
// the list from the server afterward instead of optimistically mutating
// local state, which would drift from reality on any of those failures.
//
// Query key is ["role-requests"] (no status filter) for this page's full
// list — the Sidebar's pending-count badge (SidebarSignupRequestsItem) uses
// ["role-requests", "pending"], sharing the same prefix, so invalidating
// ["role-requests"] here also refreshes the Sidebar badge instantly.

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SignupRequest } from "@/src/data/signupRequestsData/signupRequestsData";
import { signupRequestsService } from "@/src/services/signupRequestsService";
import { rolesService } from "@/src/services/settingsService";

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

  // Approve flow — holds the request being approved, or null when the
  // modal is closed.
  const [approveTarget, setApproveTarget] = useState<SignupRequest | null>(null);

  // Reject flow — holds the ID to delete, or null when closed.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const invalidateRoleRequests = () =>
    queryClient.invalidateQueries({ queryKey: ["role-requests"] });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Step 1: user clicks Approve → open role-select modal
  const handleApproveClick = (request: SignupRequest) => setApproveTarget(request);
  const handleCancelApprove = () => setApproveTarget(null);

  // Step 2a: user picks a role and confirms
  const approveMutation = useMutation({
    mutationFn: (roleId: string) => {
      if (!approveTarget) throw new Error("No request selected");
      return signupRequestsService.approveRequest(approveTarget.id, roleId);
    },
    onSettled: () => {
      // Refetch regardless of success/failure — errors (e.g. "No therapist
      // record found...", "Request already reviewed.") are surfaced
      // verbatim by the apiClient toast interceptor, and the list should
      // reflect whatever the server's real state ended up being either way.
      setApproveTarget(null);
      invalidateRoleRequests();
    },
  });

  // Step 1: user clicks trash → open confirm dialog
  const handleRejectClick = (id: string) => setConfirmDeleteId(id);
  const handleCancelReject = () => setConfirmDeleteId(null);

  // Step 2a: user confirms → permanently deletes the user account
  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => signupRequestsService.rejectRequest(requestId),
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
    // Approve flow
    approveTarget,
    isApproving: approveMutation.isPending,
    handleApproveClick,
    handleConfirmApprove: (roleId: string) => approveMutation.mutateAsync(roleId).catch(() => {}),
    handleCancelApprove,
    // Reject flow
    confirmDeleteId,
    isDeleting: rejectMutation.isPending,
    handleRejectClick,
    handleConfirmReject: () =>
      confirmDeleteId ? rejectMutation.mutateAsync(confirmDeleteId).catch(() => {}) : undefined,
    handleCancelReject,
  };
}
