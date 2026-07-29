"use client";

// src/hooks/useSignupRequests.ts
//
// Manages the signup requests list plus the approve (role-select modal) and
// reject (confirm-delete) flows. Approvals/rejections can fail for reasons
// the UI can't predict up front (missing Therapist record, another admin
// already reviewed the request in another tab) — so both flows refetch the
// list from the server afterward instead of optimistically mutating local
// state, which would drift from reality on any of those failures.

import { useCallback, useEffect, useState } from "react";
import type { SignupRequest } from "@/src/data/signupRequestsData/signupRequestsData";
import { signupRequestsService } from "@/src/services/signupRequestsService";
import { rolesService, type SettingsRole } from "@/src/services/settingsService";

export function useSignupRequests() {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [roles, setRoles] = useState<SettingsRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Approve flow — holds the request being approved, or null when the
  // modal is closed.
  const [approveTarget, setApproveTarget] = useState<SignupRequest | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Reject flow — holds the ID to delete, or null when closed.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await signupRequestsService.fetchSignupRequests();
      setRequests(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    rolesService.fetchRoles().then(setRoles).catch(() => setRoles([]));
  }, [refetch]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Step 1: user clicks Approve → open role-select modal
  const handleApproveClick = useCallback((request: SignupRequest) => {
    setApproveTarget(request);
  }, []);

  // Step 2a: user picks a role and confirms
  const handleConfirmApprove = useCallback(
    async (roleId: string) => {
      if (!approveTarget) return;
      setIsApproving(true);
      try {
        await signupRequestsService.approveRequest(approveTarget.id, roleId);
        setApproveTarget(null);
      } catch {
        // Error toast already surfaced by the apiClient interceptor
        // (e.g. "No therapist record found...", "Request already
        // reviewed."). Refetch below regardless so the list reflects
        // whatever the server's real state ended up being.
      } finally {
        setIsApproving(false);
        await refetch();
      }
    },
    [approveTarget, refetch]
  );

  const handleCancelApprove = useCallback(() => {
    setApproveTarget(null);
  }, []);

  // Step 1: user clicks trash → open confirm dialog
  const handleRejectClick = useCallback((id: string) => {
    setConfirmDeleteId(id);
  }, []);

  // Step 2a: user confirms → permanently deletes the user account
  const handleConfirmReject = useCallback(async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await signupRequestsService.rejectRequest(confirmDeleteId);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
      await refetch();
    }
  }, [confirmDeleteId, refetch]);

  // Step 2b: user cancels
  const handleCancelReject = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  return {
    requests,
    roles,
    isLoading,
    pendingCount,
    // Approve flow
    approveTarget,
    isApproving,
    handleApproveClick,
    handleConfirmApprove,
    handleCancelApprove,
    // Reject flow
    confirmDeleteId,
    isDeleting,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
  };
}
