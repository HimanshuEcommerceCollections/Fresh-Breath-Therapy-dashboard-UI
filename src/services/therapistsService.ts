// src/services/therapistsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 6 /
// 6.1. None of these endpoints support Idempotency-Key per the docs.
//
// MISMATCH (flagged, not guessed): the real TherapistResponse only carries
// { id, name, credential, email, avatar_url, is_active, location }. The old
// mock also had activeClients/sessionsThisMonth/revenueThisMonth/
// utilizationPercent/ytdSessions/ptoHours — those aren't returned by this
// endpoint (they'd come from Dashboard/PTO/Reports aggregation, which isn't
// documented as available per-therapist here). Not fabricated; see
// TherapistCard.tsx for how the UI now handles their absence.

import { apiClient } from "@/src/lib/apiClient";

export interface TherapistLocation {
  id: string;
  name: string;
}

export interface Therapist {
  id: string;
  name: string;
  credential: string | null;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  location: TherapistLocation;
}

// MISMATCH: the Add Therapist form also has "Specialization" and
// "Employment Status" fields — neither exists on the backend's Therapist
// model (section 6's create body is only name/credential/location_id/email/
// avatar_url). Kept in the UI per the "don't guess, flag it" instruction,
// but they are NOT sent in this payload.
export interface AddTherapistPayload {
  name: string;
  credential?: string;
  locationId: string;
  email: string;
  avatarUrl?: string;
}

interface ApiTherapist {
  id: string;
  name: string;
  credential: string | null;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  location: TherapistLocation;
}

function toTherapist(raw: ApiTherapist): Therapist {
  return {
    id: raw.id,
    name: raw.name,
    credential: raw.credential,
    email: raw.email,
    avatarUrl: raw.avatar_url,
    isActive: raw.is_active,
    location: raw.location,
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
      location_id: payload.locationId,
      email: payload.email,
      avatar_url: payload.avatarUrl,
    });
    return toTherapist(res.data);
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
