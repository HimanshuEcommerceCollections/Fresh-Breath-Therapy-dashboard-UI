// src/services/signupRequestsService.ts
//
// Wired to the real backend per Signup_Requests_API_Contract.md — endpoints
// under /api/auth/role-requests. Reject/revoke is a genuine DELETE that
// permanently removes the underlying user account, not a soft "rejected"
// status — there is no rejected status in the API; a removed request simply
// stops existing.

import { AxiosError } from "axios";
import { apiClient } from "@/src/lib/apiClient";
import { showErrorToast } from "@/src/lib/toast";
import type { SignupRequest, SignupRequestStatus } from "@/src/data/signupRequestsData/signupRequestsData";

interface ApiSignupRequest {
  id: string;
  status: SignupRequestStatus;
  created_at: string;
  reviewed_at: string | null;
  user: { id: string; name: string; email: string };
  requested_role: { id: string; name: string } | null;
  linked_therapist: { id: string; name: string; is_active: boolean } | null;
}

function toSignupRequest(raw: ApiSignupRequest): SignupRequest {
  return {
    id: raw.id,
    status: raw.status,
    createdAt: raw.created_at,
    reviewedAt: raw.reviewed_at,
    user: raw.user,
    requestedRole: raw.requested_role,
    linkedTherapist: raw.linked_therapist
      ? {
          id: raw.linked_therapist.id,
          name: raw.linked_therapist.name,
          isActive: raw.linked_therapist.is_active,
        }
      : null,
  };
}

// Thrown by removeRequest when the backend refuses to revoke an approved
// account because its linked therapist is still active (409,
// detail.code === "therapist_active"). The page shows its own popup for
// this instead of the generic error toast.
export class TherapistStillActiveError extends Error {
  constructor(
    message: string,
    readonly therapist: { id: string; name: string }
  ) {
    super(message);
    this.name = "TherapistStillActiveError";
  }
}

interface TherapistActiveDetail {
  code: "therapist_active";
  message: string;
  therapist: { id: string; name: string };
}

function therapistActiveDetail(error: unknown): TherapistActiveDetail | null {
  if (!(error instanceof AxiosError) || error.response?.status !== 409) return null;
  const detail = error.response.data?.detail;
  return detail && typeof detail === "object" && detail.code === "therapist_active"
    ? (detail as TherapistActiveDetail)
    : null;
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

  // Moves an already-approved account to another role. Same therapist-linking
  // rules as approval, so the same 400s surface through the default toast.
  async changeRole(requestId: string, roleId: string): Promise<SignupRequest> {
    const res = await apiClient.patch<ApiSignupRequest>(
      `/api/auth/role-requests/${requestId}/role`,
      { role_id: roleId }
    );
    return toSignupRequest(res.data);
  },

  // 204 No Content — permanently deletes the underlying user account, for a
  // pending request (reject) or an approved one (revoke access). The
  // "therapist still active" refusal becomes a TherapistStillActiveError for
  // the page's popup; every other error still gets the usual toast.
  async removeRequest(requestId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/auth/role-requests/${requestId}`, { skipErrorToast: true });
    } catch (error) {
      const detail = therapistActiveDetail(error);
      if (detail) throw new TherapistStillActiveError(detail.message, detail.therapist);
      const message = (error as AxiosError<{ detail?: unknown }>).response?.data?.detail;
      if (typeof message === "string") showErrorToast(message);
      throw error;
    }
  },
};
