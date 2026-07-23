// src/services/ptoService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 13.
// Maps cleanly onto the existing mock shapes — by_location alone feeds both
// the bar chart and the location breakdown list, same as the two mock files
// it replaces.
//
// Note: POST /api/pto/usage (record PTO usage, Admin only) exists on the
// backend, but no "record usage" form/modal exists anywhere in this
// frontend's current design — not built here, since inventing that UI from
// scratch wasn't part of "replace mock data with real calls" and no mockup
// exists to follow.

import { apiClient } from "@/src/lib/apiClient";

export interface PTOStats {
  totalTherapists: number;
  totalSessions: number;
  ptoAccrued: number;
  ptoUsed: number;
  ptoBalance: number;
}

export interface PTOLocationBreakdown {
  locationId: string;
  location: string;
  therapistCount: number;
  sessions: number;
  ptoHours: number;
}

export interface PTOLeaderboardEntry {
  rank: number;
  therapistId: string;
  name: string;
  credential: string;
  location: string;
  ytdSessions: number;
  ptoAccrued: number;
  ptoUsed: number;
  balance: number;
  avgPerWeek: number;
}

export interface PTODashboardData {
  stats: PTOStats;
  byLocation: PTOLocationBreakdown[];
  leaderboard: PTOLeaderboardEntry[];
}

interface ApiPTO {
  stats: {
    total_therapists: number;
    total_sessions: number;
    pto_accrued: number;
    pto_used: number;
    pto_balance: number;
  };
  by_location: {
    location_id: string;
    location_name: string;
    therapist_count: number;
    session_count: number;
    pto_hours: number;
  }[];
  leaderboard: {
    rank: number;
    therapist_id: string;
    therapist_name: string;
    credential: string;
    location_name: string;
    ytd_sessions: number;
    pto_accrued: number;
    pto_used: number;
    balance: number;
    avg_per_week: number;
  }[];
}

function toPTODashboardData(raw: ApiPTO): PTODashboardData {
  return {
    stats: {
      totalTherapists: raw.stats.total_therapists,
      totalSessions: raw.stats.total_sessions,
      ptoAccrued: raw.stats.pto_accrued,
      ptoUsed: raw.stats.pto_used,
      ptoBalance: raw.stats.pto_balance,
    },
    byLocation: raw.by_location.map((l) => ({
      locationId: l.location_id,
      location: l.location_name,
      therapistCount: l.therapist_count,
      sessions: l.session_count,
      ptoHours: l.pto_hours,
    })),
    leaderboard: raw.leaderboard.map((entry) => ({
      rank: entry.rank,
      therapistId: entry.therapist_id,
      name: entry.therapist_name,
      credential: entry.credential,
      location: entry.location_name,
      ytdSessions: entry.ytd_sessions,
      ptoAccrued: entry.pto_accrued,
      ptoUsed: entry.pto_used,
      balance: entry.balance,
      avgPerWeek: entry.avg_per_week,
    })),
  };
}

export const ptoService = {
  async fetchPTODashboard(): Promise<PTODashboardData> {
    const res = await apiClient.get<ApiPTO>("/api/pto");
    return toPTODashboardData(res.data);
  },
};
