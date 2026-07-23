// src/services/clientsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 8.
// GET/POST here follow the same Title-Case-label-at-the-UI-boundary
// convention as leadsService.ts.
//
// UPDATE: the "Add Client" lead-search flow (LeadSearchSection: search
// existing leads, one-click "Add Lead →" to convert) now has a real backend
// endpoint — POST /api/leads/{lead_id}/convert (section 7). It takes no
// request body and returns the full new ClientResponse, mapped below with
// the same toClient() used by the rest of this service. The backend 400s if
// the lead has no therapist_id assigned (Client.therapist_id is
// non-nullable) — useClients.ts disables the "Add Lead" action up front for
// leads without a therapist instead of relying on that error.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import type { ClientStatus } from "@/src/data/clientsData/clientsData";

type ApiClientStatus =
  | "consultation_completed"
  | "therapy_session_booked"
  | "ongoing_therapy"
  | "completed_program";

const STATUS_TO_LABEL: Record<ApiClientStatus, ClientStatus> = {
  consultation_completed: "Consultation Completed",
  therapy_session_booked: "Therapy Session Booked",
  ongoing_therapy: "Ongoing Therapy",
  completed_program: "Completed Program",
};

const LABEL_TO_STATUS: Record<ClientStatus, ApiClientStatus> = {
  "Consultation Completed": "consultation_completed",
  "Therapy Session Booked": "therapy_session_booked",
  "Ongoing Therapy": "ongoing_therapy",
  "Completed Program": "completed_program",
};

export interface Client {
  id: string;
  name: string;
  email: string;
  therapist: string;
  therapistId: string;
  location: string;
  locationId: string;
  sessions: number;
  lifetimeValue: number;
  status: ClientStatus;
  createdAt: string;
}

export interface ClientFilters {
  statusFilter?: ClientStatus;
  locationId?: string;
  search?: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  therapistId: string;
  locationId: string;
  status?: ClientStatus;
}

interface ApiClient {
  id: string;
  name: string;
  email: string;
  status: ApiClientStatus;
  created_at: string;
  location: { id: string; name: string };
  therapist: { id: string; name: string };
  lifetime_value: string;
  sessions_count: number;
}

function toClient(raw: ApiClient): Client {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    therapist: raw.therapist.name,
    therapistId: raw.therapist.id,
    location: raw.location.name,
    locationId: raw.location.id,
    sessions: raw.sessions_count,
    lifetimeValue: parseFloat(raw.lifetime_value),
    status: STATUS_TO_LABEL[raw.status],
    createdAt: raw.created_at,
  };
}

export const clientsService = {
  async fetchClients(filters?: ClientFilters): Promise<Client[]> {
    const res = await apiClient.get<ApiClient[]>("/api/clients", {
      params: {
        status_filter: filters?.statusFilter ? LABEL_TO_STATUS[filters.statusFilter] : undefined,
        location_id: filters?.locationId || undefined,
        search: filters?.search || undefined,
      },
    });
    return res.data.map(toClient);
  },

  async createClient(payload: CreateClientPayload): Promise<Client> {
    const res = await apiClient.post<ApiClient>(
      "/api/clients",
      {
        name: payload.name,
        email: payload.email,
        therapist_id: payload.therapistId,
        location_id: payload.locationId,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toClient(res.data);
  },

  async convertLeadToClient(leadId: string): Promise<Client> {
    const res = await apiClient.post<ApiClient>(
      `/api/leads/${leadId}/convert`,
      undefined,
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toClient(res.data);
  },
};
