// src/services/sessionsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 11.
// Search response already includes joined client/therapist {id, name}
// sub-objects, so — unlike Follow-Ups/Payments — no separate client-side
// join is needed here.
//
// MISMATCH (flagged, not guessed — see useSessions.ts / the Sessions
// integration report): this only wires the List view. The Day/Week/Month
// calendar views each read from their own separately-hardcoded mock
// datasets (dayViewData.ts/weekViewData.ts/monthViewData.ts) that aren't
// derived from a shared source and aren't shaped like this API's flat
// session list. The backend only exposes a flat searchable list (section
// 11) — it doesn't define how sessions should be bucketed into day/week/
// month grids, which "today" cell to highlight, etc. That's frontend
// calendar-layout logic with no spec to follow, so those three views are
// left on mock data rather than guessed at.

import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";

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
  async searchSessions(filters?: SessionSearchFilters): Promise<Session[]> {
    const res = await apiClient.post<ApiSession[]>("/api/sessions/search", {
      therapist_ids: filters?.therapistIds?.length ? filters.therapistIds : null,
      client_id: filters?.clientId ?? null,
      status: filters?.status ? LABEL_TO_STATUS[filters.status] : null,
      date_from: filters?.dateFrom ?? null,
      date_to: filters?.dateTo ?? null,
    });
    return res.data.map(toSession);
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
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toSession(res.data);
  },

  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/api/sessions/${sessionId}`);
  },
};
