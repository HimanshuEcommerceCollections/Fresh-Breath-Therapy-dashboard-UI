// src/services/signupRequestsService.ts
//
// Wired to the real backend per Signup_Requests_API_Contract.md — three
// endpoints under /api/auth/role-requests, none of which support
// Idempotency-Key. Reject is a genuine DELETE that permanently removes the
// underlying user account, not a soft "rejected" status — there is no
// rejected status in the API; a rejected request simply stops existing.

import { apiClient } from "@/src/lib/apiClient";
import type { SignupRequest, SignupRequestStatus } from "@/src/data/signupRequestsData/signupRequestsData";

interface ApiSignupRequest {
  id: string;
  status: SignupRequestStatus;
  created_at: string;
  reviewed_at: string | null;
  user: { id: string; name: string; email: string };
  requested_role: { id: string; name: string } | null;
}

function toSignupRequest(raw: ApiSignupRequest): SignupRequest {
  return {
    id: raw.id,
    status: raw.status,
    createdAt: raw.created_at,
    reviewedAt: raw.reviewed_at,
    user: raw.user,
    requestedRole: raw.requested_role,
  };
}

export const signupRequestsService = {
  async fetchSignupRequests(statusFilter?: SignupRequestStatus): Promise<SignupRequest[]> {
    const res = await apiClient.get<ApiSignupRequest[]>("/api/auth/role-requests", {
      params: statusFilter ? { status_filter: statusFilter } : undefined,
    });
    return res.data.map(toSignupRequest);
  },

  // Errors (400 "No therapist record found...", "already linked to another
  // user account", "Request already reviewed.") are surfaced verbatim via
  // the apiClient's default error toast — the backend's `detail` string is
  // already the exact user-facing message here, nothing to translate.
  async approveRequest(requestId: string, roleId: string): Promise<SignupRequest> {
    const res = await apiClient.post<ApiSignupRequest>(
      `/api/auth/role-requests/${requestId}/approve`,
      { role_id: roleId }
    );
    return toSignupRequest(res.data);
  },

  // 204 No Content — permanently deletes the underlying user account.
  async rejectRequest(requestId: string): Promise<void> {
    await apiClient.delete(`/api/auth/role-requests/${requestId}`);
  },
};
