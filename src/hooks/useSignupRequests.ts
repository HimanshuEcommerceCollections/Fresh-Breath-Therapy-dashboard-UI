"use client";

// src/hooks/useSignupRequests.ts
//
// Manages the signup requests list, role updates, reject-and-delete flow
// (with confirmation state), and the derived pending count used by the
// sidebar badge. Mirrors the useNotifications pattern.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type SignupRequest,
  type SignupRequestRole,
  signupRequestsMock,
} from "@/src/data/signupRequestsData/signupRequestsData";
import { signupRequestsService } from "@/src/services/signupRequestsService";

export function useSignupRequests() {
  const [requests, setRequests] = useState<SignupRequest[]>(signupRequestsMock);
  const [isLoading, setIsLoading] = useState(false);

  // Confirmation dialog state — holds the ID to delete, or null when closed.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load on mount (same pattern as useNotifications)
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    signupRequestsService
      .fetchSignupRequests()
      .then((data) => {
        if (mounted) setRequests(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Derived pending count — drives the sidebar badge
  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "Pending").length,
    [requests],
  );

  // Role update — calls service immediately, optimistically updates local state
  const handleRoleChange = useCallback(
    async (id: string, newRole: SignupRequestRole) => {
      // Optimistic update
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, role: newRole } : r)),
      );
      // Fire-and-forget stub (no rollback needed for demo)
      await signupRequestsService.updateRole(id, newRole);
    },
    [],
  );

  // Step 1: user clicks trash → open confirm dialog
  const handleRejectClick = useCallback((id: string) => {
    setConfirmDeleteId(id);
  }, []);

  // Step 2a: user confirms → call service, remove row
  const handleConfirmReject = useCallback(async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      const res = await signupRequestsService.rejectAndDeleteUser(
        confirmDeleteId,
      );
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r.id !== confirmDeleteId));
      }
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }, [confirmDeleteId]);

  // Step 2b: user cancels
  const handleCancelReject = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  return {
    requests,
    isLoading,
    pendingCount,
    handleRoleChange,
    // Confirm-delete flow
    confirmDeleteId,
    isDeleting,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
  };
}
