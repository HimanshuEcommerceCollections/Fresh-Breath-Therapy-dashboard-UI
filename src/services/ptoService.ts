// src/services/ptoService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 13.
// Maps cleanly onto the existing mock shapes — by_location alone feeds both
// the bar chart and the location breakdown list, same as the two mock files
// it replaces.
//
// PTO arithmetic, in one place, because it isn't obvious from the UI:
//
//   accrued  — automatic. Every session marked Completed appends an `accrual`
//              row of 0.04h to pto_transactions. Nobody types this.
//   used     — manual. There is no signal in the system that a therapist took
//              leave, so an admin records it via POST /api/pto/usage, which is
//              what recordPTOUsage below drives.
//   balance  — accrued minus used, derived on read. Never stored.

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

export interface PTOTransaction {
  id: string;
  type: "accrual" | "usage";
  hours: number;
  date: string | null;
  reason: string | null;
  createdAt: string;
}

interface ApiPTOTransaction {
  id: string;
  type: "accrual" | "usage";
  hours: number;
  date: string | null;
  reason: string | null;
  created_at: string;
}

export interface RecordPTOUsagePayload {
  therapistId: string;
  hours: number;
  date: string;
  reason?: string;
}

export const ptoService = {
  async fetchPTODashboard(): Promise<PTODashboardData> {
    const res = await apiClient.get<ApiPTO>("/api/pto");
    return toPTODashboardData(res.data);
  },

  /** One therapist's PTO ledger, newest first — the rows behind their totals. */
  async fetchTherapistTransactions(therapistId: string): Promise<PTOTransaction[]> {
    const res = await apiClient.get<ApiPTOTransaction[]>(
      `/api/pto/therapists/${therapistId}/transactions`,
    );
    return res.data.map((t) => ({
      id: t.id,
      type: t.type,
      hours: Number(t.hours),
      date: t.date,
      reason: t.reason,
      createdAt: t.created_at,
    }));
  },

  /** Admin only. Rejected by the backend if hours exceed the current balance. */
  async recordPTOUsage(payload: RecordPTOUsagePayload): Promise<void> {
    await apiClient.post("/api/pto/usage", {
      therapist_id: payload.therapistId,
      hours: payload.hours,
      date: payload.date,
      reason: payload.reason || null,
    });
  },
};
