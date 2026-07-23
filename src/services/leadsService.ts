// src/services/leadsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 7.
// The UI keeps working in the existing Title-Case LeadStatus label space
// (from data/leadsData/leadsData.ts) — this service maps to/from the
// backend's snake_case enum only at the request/response boundary, so
// LeadsTableRow/PipelineCard/PipelineColumn/StatusDropdownMenu etc. needed
// no changes beyond their `Lead` type import source.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import type { LeadStatus } from "@/src/data/leadsData/leadsData";

type ApiLeadStatus =
  | "new_lead"
  | "contacted"
  | "consultation_scheduled"
  | "consultation_completed"
  | "therapy_session_booked"
  | "ongoing_therapy"
  | "completed_program"
  | "inactive_client";

const STATUS_TO_LABEL: Record<ApiLeadStatus, LeadStatus> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  consultation_scheduled: "Consultation Scheduled",
  consultation_completed: "Consultation Completed",
  therapy_session_booked: "Therapy Session Booked",
  ongoing_therapy: "Ongoing Therapy",
  completed_program: "Completed Program",
  inactive_client: "Inactive Client",
};

const LABEL_TO_STATUS: Record<LeadStatus, ApiLeadStatus> = {
  "New Lead": "new_lead",
  Contacted: "contacted",
  "Consultation Scheduled": "consultation_scheduled",
  "Consultation Completed": "consultation_completed",
  "Therapy Session Booked": "therapy_session_booked",
  "Ongoing Therapy": "ongoing_therapy",
  "Completed Program": "completed_program",
  "Inactive Client": "inactive_client",
};

// MISMATCH (flagged, not guessed): section 7 shows the lead list item's
// therapist field only as `"therapist": {...} | null` — the sub-object's
// exact fields aren't enumerated. Assuming {id, name}, consistent with how
// `location` is shaped everywhere else in this API.
export interface Lead {
  id: string;
  name: string;
  age: number | null;
  genderOrPronoun: string;
  email: string;
  phone: string;
  location: string;
  locationId: string;
  therapist: string;
  therapistId: string | null;
  source: string;
  status: LeadStatus;
  convertedClientId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  statusFilter?: LeadStatus;
  locationId?: string;
  search?: string;
}

export interface CreateLeadPayload {
  name: string;
  age?: number;
  genderOrPronoun?: string;
  email: string;
  phone: string;
  locationId: string;
  therapistId?: string;
  source?: string;
  status?: LeadStatus;
}

interface ApiLead {
  id: string;
  name: string;
  age: number | null;
  gender_or_pronoun: string | null;
  email: string;
  phone: string;
  source: string | null;
  status: ApiLeadStatus;
  converted_client_id: string | null;
  created_at: string;
  updated_at: string;
  location: { id: string; name: string };
  therapist: { id: string; name: string } | null;
}

function toLead(raw: ApiLead): Lead {
  return {
    id: raw.id,
    name: raw.name,
    age: raw.age,
    genderOrPronoun: raw.gender_or_pronoun ?? "",
    email: raw.email,
    phone: raw.phone,
    location: raw.location.name,
    locationId: raw.location.id,
    therapist: raw.therapist?.name ?? "",
    therapistId: raw.therapist?.id ?? null,
    source: raw.source ?? "",
    status: STATUS_TO_LABEL[raw.status],
    convertedClientId: raw.converted_client_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const leadsService = {
  async fetchLeads(filters?: LeadFilters): Promise<Lead[]> {
    const res = await apiClient.get<ApiLead[]>("/api/leads", {
      params: {
        status_filter: filters?.statusFilter ? LABEL_TO_STATUS[filters.statusFilter] : undefined,
        location_id: filters?.locationId || undefined,
        search: filters?.search || undefined,
      },
    });
    return res.data.map(toLead);
  },

  async createLead(payload: CreateLeadPayload): Promise<Lead> {
    const res = await apiClient.post<ApiLead>(
      "/api/leads",
      {
        name: payload.name,
        age: payload.age,
        gender_or_pronoun: payload.genderOrPronoun,
        email: payload.email,
        phone: payload.phone,
        location_id: payload.locationId,
        therapist_id: payload.therapistId,
        source: payload.source,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toLead(res.data);
  },

  async updateLead(leadId: string, payload: Partial<CreateLeadPayload>): Promise<Lead> {
    const res = await apiClient.patch<ApiLead>(
      `/api/leads/${leadId}`,
      {
        name: payload.name,
        age: payload.age,
        gender_or_pronoun: payload.genderOrPronoun,
        email: payload.email,
        phone: payload.phone,
        location_id: payload.locationId,
        therapist_id: payload.therapistId,
        source: payload.source,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toLead(res.data);
  },

  async deleteLead(leadId: string): Promise<void> {
    await apiClient.delete(`/api/leads/${leadId}`);
  },
};
