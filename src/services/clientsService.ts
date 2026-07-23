// src/services/clientsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 8.
// GET/POST here follow the same Title-Case-label-at-the-UI-boundary
// convention as leadsService.ts.
//
// MISMATCH (flagged, not guessed — STOPPING here rather than inventing
// behavior): the Clients page's entire "Add Client" flow (LeadSearchSection:
// search existing leads, one-click "Add Lead →" to convert) has NO
// backend counterpart. Section 8's only creation path is POST /api/clients
// with {name, email, therapist_id, location_id, status?} — a direct client
// create, not a lead-conversion endpoint. There is also no endpoint anywhere
// in the docs that sets Lead.converted_client_id (Reports section 15
// explicitly confirms this field "is not currently populated by any
// automatic process"). convertLeadToClient() below is left as the original
// mock stub — calling it does not create a real client or touch the real
// leads list. The plain Clients table/search now use real data; the
// lead-search-to-convert UI does not, until a real endpoint exists (or the
// UI itself is redesigned as a direct "create client" form using the real
// POST /api/clients).

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

  // MISMATCH: no real "convert lead to client" endpoint exists — kept as the
  // original mock stub. Does not create a real client or mutate real leads.
  async convertLeadToClient(_leadId: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
  },
};
