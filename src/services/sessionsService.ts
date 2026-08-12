// src/services/sessionsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 11.
// Search response already includes joined client/therapist {id, name}
// sub-objects, so — unlike Follow-Ups/Payments — no separate client-side
// join is needed here.
//
// searchSessions() powers all four Sessions page views (List, Day, Week,
// Month) — there is no separate per-view endpoint. The List view calls it
// unbounded; the calendar views (see useSessionsPage.ts) pass a
// date_from/date_to range computed client-side from the selected date, then
// bucket the flat response into day/week/month grids themselves.

import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import type { Page } from "@/src/lib/pagination";

type ApiSessionStatus = "scheduled" | "completed" | "cancelled" | "no_show" | "rescheduled";
type ApiSessionType =
  | "individual_therapy"
  | "couples_therapy"
  | "family_therapy"
  | "group_therapy"
  | "consultation";

const STATUS_TO_LABEL: Record<ApiSessionStatus, SessionStatus> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
  rescheduled: "Rescheduled",
};
const LABEL_TO_STATUS: Record<SessionStatus, ApiSessionStatus> = {
  Scheduled: "scheduled",
  Completed: "completed",
  Cancelled: "cancelled",
  "No Show": "no_show",
  Rescheduled: "rescheduled",
};

const TYPE_TO_LABEL: Record<ApiSessionType, string> = {
  individual_therapy: "Individual Therapy",
  couples_therapy: "Couples Therapy",
  family_therapy: "Family Therapy",
  group_therapy: "Group Therapy",
  consultation: "Consultation",
};
const LABEL_TO_TYPE: Record<string, ApiSessionType> = {
  "Individual Therapy": "individual_therapy",
  "Couples Therapy": "couples_therapy",
  "Family Therapy": "family_therapy",
  "Group Therapy": "group_therapy",
  Consultation: "consultation",
};

export interface Session {
  id: string;
  date: string;
  time: string;
  client: string;
  clientId: string;
  therapist: string;
  therapistId: string;
  type: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SessionSearchFilters {
  therapistIds?: string[];
  clientId?: string;
  status?: SessionStatus;
  dateFrom?: string;
  dateTo?: string;
  /** Free text matched server-side against the client's AND therapist's name. */
  search?: string;
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface ScheduleSessionPayload {
  clientId: string;
  therapistId: string;
  date: string; // ISO "YYYY-MM-DD"
  time: string; // 24h "HH:MM"
  type: string; // Title Case, from sessionTypeOptions
  status?: SessionStatus;
}

export interface UpdateSessionPayload {
  date?: string;
  time?: string;
  type?: string;
  status?: SessionStatus;
  // Reassignment. A session booked against the wrong clinician was previously
  // only fixable by deleting and re-creating it, losing its history and id.
  therapistId?: string;
  clientId?: string;
}

interface ApiSession {
  id: string;
  date: string;
  time: string;
  type: ApiSessionType;
  status: ApiSessionStatus;
  created_at: string;
  updated_at: string;
  client: { id: string; name: string };
  therapist: { id: string; name: string };
}

function toSession(raw: ApiSession): Session {
  return {
    id: raw.id,
    date: raw.date,
    time: raw.time,
    client: raw.client.name,
    clientId: raw.client.id,
    therapist: raw.therapist.name,
    therapistId: raw.therapist.id,
    type: TYPE_TO_LABEL[raw.type],
    status: STATUS_TO_LABEL[raw.status],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const sessionsService = {
  async searchSessions(
    filters?: SessionSearchFilters,
    cursor?: string,
    limit?: number
  ): Promise<Page<Session>> {
    const res = await apiClient.post<ApiPage<ApiSession>>("/api/sessions/search", {
      therapist_ids: filters?.therapistIds?.length ? filters.therapistIds : null,
      client_id: filters?.clientId ?? null,
      status: filters?.status ? LABEL_TO_STATUS[filters.status] : null,
      date_from: filters?.dateFrom ?? null,
      date_to: filters?.dateTo ?? null,
      search: filters?.search?.trim() || null,
      cursor: cursor ?? null,
      limit: limit ?? undefined,
    });
    return {
      items: res.data.items.map(toSession),
      nextCursor: res.data.next_cursor,
      hasMore: res.data.has_more,
    };
  },

  async scheduleSession(payload: ScheduleSessionPayload): Promise<Session> {
    const res = await apiClient.post<ApiSession>(
      "/api/sessions",
      {
        client_id: payload.clientId,
        therapist_id: payload.therapistId,
        date: payload.date,
        time: payload.time,
        type: LABEL_TO_TYPE[payload.type],
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toSession(res.data);
  },

  async updateSession(sessionId: string, payload: UpdateSessionPayload): Promise<Session> {
    const res = await apiClient.patch<ApiSession>(
      `/api/sessions/${sessionId}`,
      {
        date: payload.date,
        time: payload.time,
        type: payload.type ? LABEL_TO_TYPE[payload.type] : undefined,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
        therapist_id: payload.therapistId,
        client_id: payload.clientId,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toSession(res.data);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/api/sessions/${sessionId}`);
  },
};
