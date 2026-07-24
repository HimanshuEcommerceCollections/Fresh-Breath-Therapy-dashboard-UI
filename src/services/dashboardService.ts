// src/services/dashboardService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 12 —
// a single aggregate GET /api/dashboard call powers every widget on the
// page. Icon paths/colors per stat card are decorative constants (the API
// has no concept of "icon"), kept from the original mock so the visuals are
// unchanged; only the numbers are real.
//
// MISMATCH (flagged, not guessed):
// - therapist_utilization has no ptoHours field — the old mock's "X sess ·
//   Yh PTO" trailing text is now optional/omitted when absent rather than
//   showing a fake number (PTO is a separate resource's domain, see PTO
//   integration).
// - follow_up_queue's status is pending|overdue|completed (section 9's real
//   enum) — the old Dashboard-only FollowUpStatus type said "Upcoming"
//   instead of "Pending"; renamed to match reality since nothing else
//   depends on the old wording.
// - upcoming_sessions' status reuses the Sessions page's real 5-value
//   SessionStatus (Scheduled/Completed/Cancelled/No Show/Rescheduled)
//   instead of the old mock's divergent 4-value type ("Missed", no
//   "Rescheduled") — that old type didn't match section 11's real enum.

import { apiClient } from "@/src/lib/apiClient";
import type { StatCardData } from "@/src/sections/dashboardSections/StatCard";
import type { RevenuePoint } from "@/src/data/dashboardData/revenueTrendData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";
import type { FunnelStage } from "@/src/data/dashboardData/leadConversionFunnelData";
import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import type { FollowUpItem, FollowUpStatus } from "@/src/data/dashboardData/followUpQueueData";
import type { TherapistUtilization } from "@/src/data/dashboardData/therapistUtilizationData";

const LEADS_ICON_BASE = "/dashboard/dashboardicons/leadsicons";
const SESSIONS_ICON_BASE = "/dashboard/dashboardicons/sessionicons";
const REVENUE_ICON_BASE = "/dashboard/dashboardicons/revenueicons";

const BLUE = { iconColor: "#376EF4", iconBgColor: "rgba(55,110,244,0.1)" };
const GREEN = { iconColor: "#3FC168", iconBgColor: "rgba(63,193,104,0.1)" };
const ORANGE = { iconColor: "#F2A618", iconBgColor: "rgba(242,166,24,0.1)" };
const RED = { iconColor: "#F22A36", iconBgColor: "rgba(242,42,54,0.1)" };

const LEAD_FUNNEL_STAGE_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  consultation_scheduled: "Consult Scheduled",
  consultation_completed: "Consult Completed",
  therapy_session_booked: "Therapy Session Booked",
  ongoing_therapy: "Ongoing Therapy",
  completed_program: "Completed Program",
  inactive_client: "Inactive Client",
};

const PAYMENT_STATUS_LABELS: Record<string, { label: PaymentStatusSlice["status"]; color: string }> = {
  paid: { label: "Paid", color: "#3FC168" },
  partially_paid: { label: "Partially Paid", color: "#F2A618" },
  pending: { label: "Pending", color: "#376EF4" },
  overdue: { label: "Overdue", color: "#F22A36" },
};

const FOLLOW_UP_STATUS_LABELS: Record<string, FollowUpStatus> = {
  pending: "Pending",
  overdue: "Overdue",
  completed: "Completed",
};

const SESSION_STATUS_LABELS: Record<string, SessionStatus> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
  rescheduled: "Rescheduled",
};

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatMonthDay(isoDate: string): { month: string; day: string } {
  const d = new Date(isoDate);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
  };
}

interface ApiDashboard {
  leads: { total: number; new_this_month: number };
  clients: { active: number; new_last_30_days: number };
  pending_follow_ups: number;
  sessions_today: number;
  session_metrics: { total: number; completed: number; upcoming: number; missed: number; cancelled: number; today: number };
  revenue_metrics: { total_revenue: number; monthly_revenue: number; pending_payments: number; collected: number; avg_per_client: number };
  revenue_trend: { month: string; collected: string; pending: string }[];
  payment_status: { status: string; count: number }[];
  lead_funnel: { status: string; count: number }[];
  upcoming_sessions: { date: string; time: string; client_name: string; therapist_name: string; status: string }[];
  follow_up_queue: { client_name: string; due_date: string; notes: string; status: string }[];
  therapist_utilization: { therapist_name: string; location_name: string; sessions_this_week: number; target: number }[];
}

export interface DashboardData {
  leadClientStats: StatCardData[];
  sessionMetricsStats: StatCardData[];
  revenueMetricsStats: StatCardData[];
  revenueTrend: RevenuePoint[];
  paymentStatus: PaymentStatusSlice[];
  leadFunnel: FunnelStage[];
  upcomingSessions: {
    id: string;
    month: string;
    day: string;
    clientName: string;
    time: string;
    therapistName: string;
    status: SessionStatus;
  }[];
  followUpQueue: FollowUpItem[];
  therapistUtilization: TherapistUtilization[];
}

function toDashboardData(raw: ApiDashboard): DashboardData {
  return {
    leadClientStats: [
      { label: "Total Leads", value: raw.leads.total, subtext: `${raw.leads.new_this_month} new this month`, iconSrc: `${LEADS_ICON_BASE}/totalleads.svg`, ...BLUE },
      { label: "Active Clients", value: raw.clients.active, iconSrc: `${LEADS_ICON_BASE}/activeclients.svg`, ...GREEN },
      { label: "New Clients", value: raw.clients.new_last_30_days, subtext: "Last 30 days", iconSrc: `${LEADS_ICON_BASE}/newclients.svg`, ...BLUE },
      { label: "Pending Follow-Ups", value: raw.pending_follow_ups, iconSrc: `${LEADS_ICON_BASE}/pendingfollowups.svg`, ...ORANGE },
      { label: "Sessions Today", value: raw.sessions_today, iconSrc: `${LEADS_ICON_BASE}/sessiontoday.svg`, ...BLUE },
    ],
    sessionMetricsStats: [
      { label: "Total Sessions", value: raw.session_metrics.total, iconSrc: `${LEADS_ICON_BASE}/sessiontoday.svg`, ...BLUE },
      { label: "Completed", value: raw.session_metrics.completed, iconSrc: `${SESSIONS_ICON_BASE}/completed.svg`, ...GREEN },
      { label: "Upcoming", value: raw.session_metrics.upcoming, iconSrc: `${SESSIONS_ICON_BASE}/upcoming.svg`, ...BLUE },
      { label: "Missed", value: raw.session_metrics.missed, iconSrc: `${SESSIONS_ICON_BASE}/missed.svg`, ...RED },
      { label: "Cancelled", value: raw.session_metrics.cancelled, iconSrc: `${SESSIONS_ICON_BASE}/cancelled.svg`, ...ORANGE },
    ],
    revenueMetricsStats: [
      { label: "Total Revenue", value: formatCurrency(raw.revenue_metrics.total_revenue), iconSrc: `${REVENUE_ICON_BASE}/totalrevenue.svg`, ...GREEN },
      { label: "Monthly Revenue", value: formatCurrency(raw.revenue_metrics.monthly_revenue), iconSrc: `${REVENUE_ICON_BASE}/monthlyrevenue.svg`, ...BLUE },
      { label: "Pending Payments", value: formatCurrency(raw.revenue_metrics.pending_payments), iconSrc: `${REVENUE_ICON_BASE}/pendingpayments.svg`, ...ORANGE },
      { label: "Collected", value: formatCurrency(raw.revenue_metrics.collected), iconSrc: `${REVENUE_ICON_BASE}/collected.svg`, ...GREEN },
      { label: "Avg / Client", value: formatCurrency(raw.revenue_metrics.avg_per_client), iconSrc: `${REVENUE_ICON_BASE}/avgclients.svg`, ...BLUE },
    ],
    revenueTrend: raw.revenue_trend.map((p) => ({
      month: p.month,
      collected: parseFloat(p.collected),
      pending: parseFloat(p.pending),
    })),
    paymentStatus: raw.payment_status.map((p) => ({
      status: PAYMENT_STATUS_LABELS[p.status]?.label ?? "Pending",
      value: p.count,
      color: PAYMENT_STATUS_LABELS[p.status]?.color ?? "#376EF4",
    })),
    leadFunnel: raw.lead_funnel.map((f) => ({
      stage: LEAD_FUNNEL_STAGE_LABELS[f.status] ?? f.status,
      value: f.count,
    })),
    upcomingSessions: raw.upcoming_sessions.map((s, index) => {
      const { month, day } = formatMonthDay(s.date);
      return {
        id: `${s.date}-${s.time}-${index}`,
        month,
        day,
        clientName: s.client_name,
        time: s.time,
        therapistName: s.therapist_name,
        status: SESSION_STATUS_LABELS[s.status] ?? "Scheduled",
      };
    }),
    followUpQueue: raw.follow_up_queue.map((f, index) => ({
      id: `${f.client_name}-${f.due_date}-${index}`,
      clientName: f.client_name,
      date: f.due_date,
      note: f.notes,
      status: FOLLOW_UP_STATUS_LABELS[f.status] ?? "Pending",
    })),
    therapistUtilization: raw.therapist_utilization.map((t, index) => ({
      id: `${t.therapist_name}-${index}`,
      name: t.therapist_name,
      city: t.location_name,
      sessionsCount: t.sessions_this_week,
      ptoHours: undefined,
    })),
  };
}

export const dashboardService = {
  async fetchDashboard(): Promise<DashboardData> {
    const res = await apiClient.get<ApiDashboard>("/api/dashboard");
    return toDashboardData(res.data);
  },
};
