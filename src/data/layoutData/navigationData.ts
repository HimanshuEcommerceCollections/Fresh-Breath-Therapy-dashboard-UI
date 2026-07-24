import type { RoleName } from "@/src/services/authService";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  // Omit to allow every role. Section 1.3 + the Full Permission Matrix
  // (section 16) define who can see what: Therapist is scoped to their own
  // Leads/Clients/Sessions/Follow-Ups only, so every other nav item is
  // Admin/Coordinator only. Signup Requests (role-request approval) is
  // Admin only.
  roles?: RoleName[];
};

export type NavGroup = {
  groupLabel: string;
  items: NavItem[];
};

const ICON_BASE = "/dashboard/dashboardicons/sidebaricons";

export const navigationGroups: NavGroup[] = [
  {
    groupLabel: "WORKSPACE",
    items: [
      { label: "Dashboard", href: "/", icon: `${ICON_BASE}/dashboardicon.png`, roles: ["Admin", "Coordinator"] },
      { label: "Leads", href: "/leads", icon: `${ICON_BASE}/leadsicon.png` },
      { label: "Clients", href: "/clients", icon: `${ICON_BASE}/clientsicon.png` },
      { label: "Signup Requests", href: "/signup-requests", icon: `${ICON_BASE}/signuprequestsicon.png`, roles: ["Admin"] },
      { label: "Sessions", href: "/sessions", icon: `${ICON_BASE}/sessionsIcon.png` },
      { label: "Follow-Ups", href: "/follow-ups", icon: `${ICON_BASE}/followupicon.png` },
      { label: "Payments", href: "/payments", icon: `${ICON_BASE}/paymentsicon.png`, roles: ["Admin", "Coordinator"] },
    ],
  },
  {
    groupLabel: "TEAM",
    items: [
      { label: "Therapists", href: "/therapists", icon: `${ICON_BASE}/therapisticon.png`, roles: ["Admin", "Coordinator"] },
      { label: "PTO Dashboard", href: "/pto-dashboard", icon: `${ICON_BASE}/ptodashboard.png`, roles: ["Admin", "Coordinator"] },
    ],
  },
  {
    groupLabel: "INSIGHTS",
    items: [
      { label: "Reports", href: "/reports", icon: `${ICON_BASE}/reportsicon.png`, roles: ["Admin", "Coordinator"] },
      { label: "Settings", href: "/settings", icon: `${ICON_BASE}/settingsicon.png`, roles: ["Admin", "Coordinator"] },
    ],
  },
];
