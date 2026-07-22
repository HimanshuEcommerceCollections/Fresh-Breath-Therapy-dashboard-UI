// TODO: replace with backend-fetched roles (/api/settings/roles).
export type Role = { name: string; permissions: string }; // "·"-joined string per the reference

export const rolesData: Role[] = [
  { name: "Admin", permissions: "Full access · Manage team · Reports · Revenue · Settings" },
  { name: "Coordinator", permissions: "Full access for reading only not writing" },
  { name: "Therapist", permissions: "Only their own clients and sessions, also PTO" },
];

