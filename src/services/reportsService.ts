// src/services/reportsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 15.
// All 7 endpoints share the same range/location_id query contract.
//
// MISMATCH (flagged): the toolbar's date-range dropdown offered 5 options
// ("Last 30 days" / "Last 3 months" / "Last 6 months" / "Last 12 months" /
// "Year to date"), but the real API only supports 4 range values — there's
// no "Year to date" on the backend. Removed from the dropdown (see
// ReportsToolbar.tsx) rather than sending an unsupported value.

import { apiClient } from "@/src/lib/apiClient";

export type ReportRange = "last_30_days" | "last_3_months" | "last_6_months" | "last_12_months";

export interface ReportFilters {
  range?: ReportRange;
  locationId?: string;
}

const LEAD_STATUS_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  consultation_scheduled: "Consultation Scheduled",
  consultation_completed: "Consultation Completed",
  therapy_session_booked: "Therapy Session Booked",
  ongoing_therapy: "Ongoing Therapy",
  completed_program: "Completed Program",
  inactive_client: "Inactive Client",
};

export interface SalesReportPoint {
  month: string;
  sales: number;
}

export interface ClientDistributionSlice {
  status: string;
  count: number;
}

export interface TeamPerformanceEntry {
  name: string;
  sessions: number;
}

export interface ConversionStage {
  stage: string;
  count: number;
  percent: number;
}

export interface ConversionReport {
  overallRate: number;
  totalLeads: number;
  stages: ConversionStage[];
}

export interface UtilizationEntry {
  name: string;
  value: number;
}

export interface RevenueEntry {
  name: string;
  revenue: number;
}

export interface RetentionEntry {
  location: string;
  months: number;
}

function toParams(filters?: ReportFilters) {
  return { range: filters?.range, location_id: filters?.locationId || undefined };
}

export const reportsService = {
  async fetchSales(filters?: ReportFilters): Promise<SalesReportPoint[]> {
    const res = await apiClient.get<{ month: string; total: string }[]>("/api/reports/sales", {
      params: toParams(filters),
    });
    return res.data.map((p) => ({ month: p.month, sales: parseFloat(p.total) }));
  },

  // Despite the name, this is lead-pipeline distribution by status (built
  // from Lead.status, not Client.status) — per the doc's own note.
  async fetchClientDistribution(filters?: ReportFilters): Promise<ClientDistributionSlice[]> {
    const res = await apiClient.get<{ status: string; count: number }[]>("/api/reports/clients", {
      params: toParams(filters),
    });
    return res.data.map((s) => ({ status: LEAD_STATUS_LABELS[s.status] ?? s.status, count: s.count }));
  },

  async fetchTeamPerformance(filters?: ReportFilters): Promise<TeamPerformanceEntry[]> {
    const res = await apiClient.get<{ therapist_id: string; therapist_name: string; sessions: number }[]>(
      "/api/reports/team",
      { params: toParams(filters) }
    );
    return res.data.map((t) => ({ name: t.therapist_name, sessions: t.sessions }));
  },

  async fetchConversion(filters?: ReportFilters): Promise<ConversionReport> {
    const res = await apiClient.get<{
      overall_rate: number;
      total_leads: number;
      stages: { status: string; count: number; percent: number }[];
    }>("/api/reports/conversion", { params: toParams(filters) });
    return {
      overallRate: res.data.overall_rate,
      totalLeads: res.data.total_leads,
      stages: res.data.stages.map((s) => ({
        stage: LEAD_STATUS_LABELS[s.status] ?? s.status,
        count: s.count,
        percent: s.percent,
      })),
    };
  },

  async fetchUtilization(filters?: ReportFilters): Promise<UtilizationEntry[]> {
    const res = await apiClient.get<{ therapist_id: string; therapist_name: string; utilization: number }[]>(
      "/api/reports/utilization",
      { params: toParams(filters) }
    );
    return res.data.map((t) => ({ name: t.therapist_name, value: t.utilization }));
  },

  async fetchRevenue(filters?: ReportFilters): Promise<RevenueEntry[]> {
    const res = await apiClient.get<{ therapist_id: string; therapist_name: string; revenue: string }[]>(
      "/api/reports/revenue",
      { params: toParams(filters) }
    );
    return res.data.map((t) => ({ name: t.therapist_name, revenue: parseFloat(t.revenue) }));
  },

  async fetchRetention(filters?: ReportFilters): Promise<RetentionEntry[]> {
    const res = await apiClient.get<{ location_id: string; location_name: string; retention_months: number }[]>(
      "/api/reports/retention",
      { params: toParams(filters) }
    );
    return res.data.map((l) => ({ location: l.location_name, months: l.retention_months }));
  },
};
