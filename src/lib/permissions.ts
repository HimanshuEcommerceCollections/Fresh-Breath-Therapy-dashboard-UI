// src/lib/permissions.ts
//
// Role-gating rules per FBT_Backend_API_Reference.docx section 1.3 and the
// Full Permission Matrix (section 16). Keep these as the single source of
// truth for "can this role do X" — pages/components should call these
// rather than comparing role strings inline.

import type { RoleName } from "@/src/services/authService";

// Admin is the only role permitted to create/edit records (leads, clients,
// sessions, follow-ups, payments, etc). Coordinator is read-only, matching
// the backend's require_admin() guards on these write endpoints.
export function canWrite(role: RoleName | null): boolean {
  return role === "Admin";
}

// Matrix: "Sessions — Completed/Cancelled/No Show: Admin Yes, Coordinator No (403), Therapist No."
export function canSetTerminalSessionStatus(role: RoleName | null): boolean {
  return role === "Admin";
}

// Matrix: "Locations/Therapists/Packages/Feature Flags/Integrations/Organization:
// Admin Full R/W, Coordinator Read only, Therapist Read only."
export function canManageOrgSettings(role: RoleName | null): boolean {
  return role === "Admin";
}

// Matrix: "Role request approve/reject: Admin Yes, Coordinator No, Therapist No."
export function canApproveRoleRequests(role: RoleName | null): boolean {
  return role === "Admin";
}

// Matrix: "PTO — record usage: Admin Yes, Coordinator No, Therapist No."
export function canRecordPtoUsage(role: RoleName | null): boolean {
  return role === "Admin";
}

export function isAdmin(role: RoleName | null): boolean {
  return role === "Admin";
}

export function isCoordinator(role: RoleName | null): boolean {
  return role === "Coordinator";
}

export function isTherapist(role: RoleName | null): boolean {
  return role === "Therapist";
}
