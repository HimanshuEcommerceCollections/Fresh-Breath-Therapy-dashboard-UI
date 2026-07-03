// TODO: replace with backend-fetched roles (/api/settings/roles).
export type Role = { name: string; permissions: string }; // "·"-joined string per the reference

export const rolesData: Role[] = [
  { name: "Admin", permissions: "Full access · Manage team · Reports · Revenue · Settings" },
  { name: "Coordinator", permissions: "Leads · Clients · Schedule sessions · Follow-ups · Payments" },
  { name: "Therapist", permissions: "View assigned clients · Sessions · Notes · PTO" },
  { name: "Client (SaaS portal)", permissions: "Book · Reschedule · Pay invoices · Documents" },
];
