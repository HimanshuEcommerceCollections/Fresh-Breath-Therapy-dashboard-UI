import type { RoleName } from "@/src/services/authService";
import { navigationGroups } from "@/src/data/layoutData/navigationData";

export type SearchTarget = {
  label: string;
  href: string;
  group: string;
  roles?: RoleName[];
  /** Extra words that should land on this page. The nav label alone isn't
   * enough — nobody types "PTO Dashboard", they type "leave" or "time off". */
  keywords: string[];
};

// Keyed by href so the destinations stay in lockstep with navigationData
// (single source of truth for what exists and who may see it); this table only
// adds the vocabulary.
const KEYWORDS: Record<string, string[]> = {
  "/": ["dashboard", "home", "overview", "summary", "kpi", "stats", "metrics", "main"],
  "/leads": ["lead", "leads", "pipeline", "prospect", "prospects", "enquiry", "inquiry",
             "funnel", "kanban", "convert", "conversion", "new lead", "contacted"],
  "/clients": ["client", "clients", "customer", "customers", "patient", "patients",
               "roster", "active clients", "lifetime value"],
  "/signup-requests": ["signup", "sign up", "signup requests", "requests", "approval",
                       "approvals", "approve", "reject", "role request", "pending user",
                       "access request", "invite"],
  "/sessions": ["session", "sessions", "appointment", "appointments", "calendar",
                "schedule", "scheduling", "booking", "bookings", "day", "week", "month",
                "no show", "cancelled", "rescheduled"],
  "/follow-ups": ["follow up", "follow ups", "followup", "followups", "follow-up",
                  "reminder", "reminders", "due", "overdue", "task", "tasks", "check in"],
  "/payments": ["payment", "payments", "billing", "bill", "revenue", "paid",
                "unpaid", "pending payment", "cancelled payment", "collected",
                "outstanding", "money", "transaction", "transactions", "amount",
                "copay", "self-pay", "insurance"],
  "/therapists": ["therapist", "therapists", "staff", "team", "provider", "providers",
                  "clinician", "clinicians", "counsellor", "counselor", "employee",
                  "employees", "credential"],
  "/pto-dashboard": ["pto", "p t o", "leave", "time off", "timeoff", "vacation",
                     "holiday", "accrual", "accrued", "balance hours", "sick leave",
                     "pto dashboard", "utilisation", "utilization"],
  "/reports": ["report", "reports", "analytics", "analysis", "chart", "charts", "graph",
               "graphs", "insight", "insights", "sales", "retention", "utilization",
               "team performance", "revenue by therapist", "client distribution",
               "export", "csv", "pdf", "download"],
  "/settings": ["setting", "settings", "config", "configuration",
                "role", "roles", "permission", "permissions", "organization",
                "organisation", "security", "notification preferences", "saas",
                "preferences", "account", "logout", "sign out"],
};

export const searchTargets: SearchTarget[] = navigationGroups.flatMap((group) =>
  group.items.map((item) => ({
    label: item.label,
    href: item.href,
    group: group.groupLabel,
    roles: item.roles,
    keywords: KEYWORDS[item.href] ?? [],
  }))
);

function normalise(input: string): string {
  // Tolerates ".clients", "/clients", "clients!" — people type a leading dot
  // or slash out of habit, and it shouldn't stop a match.
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

/** Higher is better; 0 means no match. */
function score(target: SearchTarget, query: string): number {
  const label = normalise(target.label);
  if (label === query) return 100;
  if (label.startsWith(query)) return 90;

  let best = 0;
  for (const raw of target.keywords) {
    const keyword = normalise(raw);
    if (keyword === query) best = Math.max(best, 85);
    else if (keyword.startsWith(query)) best = Math.max(best, 70);
    else if (query.length >= 3 && keyword.includes(query)) best = Math.max(best, 55);
    // Typing more than the keyword ("payments page") should still match it.
    else if (keyword.length >= 4 && query.startsWith(keyword)) best = Math.max(best, 60);
  }
  if (label.includes(query)) best = Math.max(best, 50);
  return best;
}

export function searchNavigation(
  query: string,
  role: RoleName | null | undefined,
  limit = 6
): SearchTarget[] {
  const q = normalise(query);
  if (!q) return [];

  return searchTargets
    // Never offer a destination this role would just be bounced off.
    .filter((t) => !t.roles || (role ? t.roles.includes(role) : false))
    .map((t) => ({ t, s: score(t, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.t.label.localeCompare(b.t.label))
    .slice(0, limit)
    .map((x) => x.t);
}
