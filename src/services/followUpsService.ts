// src/services/followUpsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 9.
// `status` is COMPUTED server-side (never stored, never sent on create) —
// completed_at set → "completed"; else due_date in the past → "overdue";
// else → "pending". No location_id/search filter is documented for this
// resource, only status_filter.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";

type ApiFollowUpStatus = "pending" | "overdue" | "completed";

const STATUS_TO_LABEL: Record<ApiFollowUpStatus, FollowUpStatus> = {
  pending: "Pending",
  overdue: "Overdue",
  completed: "Completed",
};

const LABEL_TO_STATUS: Record<FollowUpStatus, ApiFollowUpStatus> = {
  Pending: "pending",
  Overdue: "overdue",
  Completed: "completed",
};

export interface FollowUp {
  id: string;
  clientId: string;
  dueDate: string;
  notes: string;
  reminder: boolean;
  completedAt: string | null;
  createdAt: string;
  status: FollowUpStatus;
}

// The list response only carries `client_id` (section 9), not a joined
// client name — useFollowUps.ts joins against the real clients list to
// produce this display shape so FollowUpTableRow needed no changes.
export interface FollowUpWithClient extends FollowUp {
  client: string;
}

export interface FollowUpStats {
  pending: number;
  overdue: number;
  completed: number;
}

export interface CreateFollowUpPayload {
  clientId: string;
  dueDate: string; // ISO "YYYY-MM-DD"
  notes?: string;
  reminder?: boolean;
}

interface ApiFollowUp {
  id: string;
  client_id: string;
  due_date: string;
  notes: string | null;
  reminder: boolean;
  completed_at: string | null;
  created_at: string;
  status: ApiFollowUpStatus;
}

function toFollowUp(raw: ApiFollowUp): FollowUp {
  return {
    id: raw.id,
    clientId: raw.client_id,
    dueDate: raw.due_date,
    notes: raw.notes ?? "",
    reminder: raw.reminder,
    completedAt: raw.completed_at,
    createdAt: raw.created_at,
    status: STATUS_TO_LABEL[raw.status],
  };
}

export const followUpsService = {
  async fetchFollowUps(statusFilter?: FollowUpStatus): Promise<FollowUp[]> {
    const res = await apiClient.get<ApiFollowUp[]>("/api/follow-ups", {
      params: { status_filter: statusFilter ? LABEL_TO_STATUS[statusFilter] : undefined },
    });
    return res.data.map(toFollowUp);
  },

  async fetchStats(): Promise<FollowUpStats> {
    const res = await apiClient.get<FollowUpStats>("/api/follow-ups/stats");
    return res.data;
  },

  async createFollowUp(payload: CreateFollowUpPayload): Promise<FollowUp> {
    const res = await apiClient.post<ApiFollowUp>(
      "/api/follow-ups",
      {
        client_id: payload.clientId,
        due_date: payload.dueDate,
        notes: payload.notes,
        reminder: payload.reminder,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toFollowUp(res.data);
  },

  async completeFollowUp(followUpId: string): Promise<FollowUp> {
    const res = await apiClient.post<ApiFollowUp>(`/api/follow-ups/${followUpId}/complete`);
    return toFollowUp(res.data);
  },

  async deleteFollowUp(followUpId: string): Promise<void> {
    await apiClient.delete(`/api/follow-ups/${followUpId}`);
  },
};
