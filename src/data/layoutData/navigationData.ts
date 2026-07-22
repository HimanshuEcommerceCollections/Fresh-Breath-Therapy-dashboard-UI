export type NavItem = {
  label: string;
  href: string;
  icon: string;
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
      { label: "Dashboard", href: "/", icon: `${ICON_BASE}/dashboardicon.png` },
      { label: "Leads", href: "/leads", icon: `${ICON_BASE}/leadsicon.png` },
      { label: "Clients", href: "/clients", icon: `${ICON_BASE}/clientsicon.png` },
      { label: "Signup Requests", href: "/signup-requests", icon: `${ICON_BASE}/signuprequestsicon.png` },
      { label: "Sessions", href: "/sessions", icon: `${ICON_BASE}/sessionsIcon.png` },
      { label: "Follow-Ups", href: "/follow-ups", icon: `${ICON_BASE}/followupicon.png` },
      { label: "Payments", href: "/payments", icon: `${ICON_BASE}/paymentsicon.png` },
    ],
  },
  {
    groupLabel: "TEAM",
    items: [
      { label: "Therapists", href: "/therapists", icon: `${ICON_BASE}/therapisticon.png` },
      { label: "PTO Dashboard", href: "/pto-dashboard", icon: `${ICON_BASE}/ptodashboard.png` },
    ],
  },
  {
    groupLabel: "INSIGHTS",
    items: [
      { label: "Reports", href: "/reports", icon: `${ICON_BASE}/reportsicon.png` },
      { label: "Settings", href: "/settings", icon: `${ICON_BASE}/settingsicon.png` },
    ],
  },
];
