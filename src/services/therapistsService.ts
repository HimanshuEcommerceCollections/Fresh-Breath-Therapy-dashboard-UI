// src/services/therapistsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 6 /
// 6.1. None of these endpoints support Idempotency-Key per the docs.
//
// UPDATE: the real TherapistResponse now also carries active_client_count,
// revenue, ytd_sessions, and pto_balance (computed server-side by reusing
// the same logic that powers /api/pto and /api/reports/*). There is
// deliberately NO utilization % field — no capacity/schedule field exists
// on Therapist to compute a genuine percentage against, so TherapistCard.tsx
// does not render one rather than fabricating a number.

import { apiClient } from "@/src/lib/apiClient";

export interface TherapistLocation {
  id: string;
  name: string;
}

export interface Therapist {
  id: string;
  name: string;
  credential: string | null;
  specialization: string | null;
  employmentStatus: string | null;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  location: TherapistLocation;
  activeClientCount: number;
  revenue: number;
  ytdSessions: number;
  ptoBalance: number;
}

// Specialization and Employment Status are real backend fields now — the
// form used to collect both and silently drop them on submit.
export interface AddTherapistPayload {
  name: string;
  credential?: string;
  specialization?: string;
  employmentStatus?: string;
  locationId: string;
  email: string;
  avatarUrl?: string;
}

// Every field optional: PATCH sends only what changed. isActive is how a
// therapist is deactivated (drives the INACTIVE badge on the card) — separate
// from employmentStatus, which is the terms they work on.
export interface UpdateTherapistPayload {
  name?: string;
  credential?: string | null;
  specialization?: string | null;
  employmentStatus?: string | null;
  locationId?: string;
  email?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
}

interface ApiTherapist {
  id: string;
  name: string;
  credential: string | null;
  specialization: string | null;
  employment_status: string | null;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  location: TherapistLocation;
  active_client_count: number;
  revenue: number;
  ytd_sessions: number;
  pto_balance: number;
}

function toTherapist(raw: ApiTherapist): Therapist {
  return {
    id: raw.id,
    name: raw.name,
    credential: raw.credential,
    specialization: raw.specialization,
    employmentStatus: raw.employment_status,
    email: raw.email,
    avatarUrl: raw.avatar_url,
    isActive: raw.is_active,
    location: raw.location,
    activeClientCount: raw.active_client_count,
    revenue: raw.revenue,
    ytdSessions: raw.ytd_sessions,
    ptoBalance: raw.pto_balance,
  };
}

export const therapistsService = {
  async fetchTherapists(locationId?: string): Promise<Therapist[]> {
    const res = await apiClient.get<ApiTherapist[]>("/api/therapists", {
      params: locationId ? { location_id: locationId } : undefined,
    });
    return res.data.map(toTherapist);
  },

  async addTherapist(payload: AddTherapistPayload): Promise<Therapist> {
    const res = await apiClient.post<ApiTherapist>("/api/therapists", {
      name: payload.name,
      credential: payload.credential,
      specialization: payload.specialization,
      employment_status: payload.employmentStatus,
      location_id: payload.locationId,
      email: payload.email,
      avatar_url: payload.avatarUrl,
    });
    return toTherapist(res.data);
  },

  async updateTherapist(
    therapistId: string,
    payload: UpdateTherapistPayload
  ): Promise<Therapist> {
    // Only send keys the caller actually set — PATCH treats an explicit null
    // as "clear this field", so passing undefined through would wipe values
    // the edit form never touched.
    const body: Record<string, unknown> = {};
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.credential !== undefined) body.credential = payload.credential;
    if (payload.specialization !== undefined) body.specialization = payload.specialization;
    if (payload.employmentStatus !== undefined) body.employment_status = payload.employmentStatus;
    if (payload.locationId !== undefined) body.location_id = payload.locationId;
    if (payload.email !== undefined) body.email = payload.email;
    if (payload.avatarUrl !== undefined) body.avatar_url = payload.avatarUrl;
    if (payload.isActive !== undefined) body.is_active = payload.isActive;

    const res = await apiClient.patch<ApiTherapist>(`/api/therapists/${therapistId}`, body);
    return toTherapist(res.data);
  },

  async deleteTherapist(therapistId: string): Promise<void> {
    await apiClient.delete(`/api/therapists/${therapistId}`);
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<{ url: string }>("/api/uploads/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  },
};
