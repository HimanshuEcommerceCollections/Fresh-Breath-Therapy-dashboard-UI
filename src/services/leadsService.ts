// src/services/leadsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 7.
// The UI keeps working in the existing Title-Case LeadStatus label space
// (from data/leadsData/leadsData.ts) — this service maps to/from the
// backend's snake_case enum only at the request/response boundary, so
// LeadsTableRow/PipelineCard/PipelineColumn/StatusDropdownMenu etc. needed
// no changes beyond their `Lead` type import source.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import { fetchAllPages, type Page } from "@/src/lib/pagination";
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
  /** The admin's own short note about this person. Shown on hover over their
   *  name in the leads table and pipeline cards. Empty string when unset. */
  note: string;
  status: LeadStatus;
  convertedClientId: string | null;
  // Captured by the public website form and delivered via the lead webhook
  // (POST /api/webhooks/leads). Empty for leads added by hand.
  message: string;
  preferredDatetime: string;
  consentGiven: boolean;
  // The automation's own tracking fields, sent as "Customer ID" / "Payment
  // Status" / "Visit Status" in the webhook payload — free text, never set
  // by the admin-facing create/edit forms, so always empty on any lead
  // added a different way.
  customerId: string;
  paymentStatus: string;
  visitStatus: string;
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
  /** `null` clears the note. Omitting the key leaves it untouched on a PATCH,
   *  so an empty box must send null rather than undefined. */
  note?: string | null;
  status?: LeadStatus;
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

interface ApiLead {
  id: string;
  name: string;
  age: number | null;
  gender_or_pronoun: string | null;
  email: string;
  phone: string;
  source: string | null;
  note: string | null;
  status: ApiLeadStatus;
  converted_client_id: string | null;
  message: string | null;
  preferred_datetime: string | null;
  consent_given: boolean;
  customer_id: string | null;
  payment_status: string | null;
  visit_status: string | null;
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
    note: raw.note ?? "",
    status: STATUS_TO_LABEL[raw.status],
    convertedClientId: raw.converted_client_id,
    message: raw.message ?? "",
    preferredDatetime: raw.preferred_datetime ?? "",
    consentGiven: raw.consent_given ?? false,
    customerId: raw.customer_id ?? "",
    paymentStatus: raw.payment_status ?? "",
    visitStatus: raw.visit_status ?? "",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export const leadsService = {
  async fetchLeads(filters?: LeadFilters, cursor?: string, limit?: number): Promise<Page<Lead>> {
    const res = await apiClient.get<ApiPage<ApiLead>>("/api/leads", {
      params: {
        status_filter: filters?.statusFilter ? LABEL_TO_STATUS[filters.statusFilter] : undefined,
        location_id: filters?.locationId || undefined,
        search: filters?.search || undefined,
        cursor,
        limit,
      },
    });
    return {
      items: res.data.items.map(toLead),
      nextCursor: res.data.next_cursor,
      hasMore: res.data.has_more,
    };
  },

  // For call sites that need every matching lead at once — the pipeline
  // (kanban) board groups by status across the full filtered set, not just
  // whatever page has scrolled into view.
  async fetchAllLeads(filters?: LeadFilters): Promise<Lead[]> {
    return fetchAllPages((cursor) => leadsService.fetchLeads(filters, cursor, 100));
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
        note: payload.note,
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
        note: payload.note,
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
