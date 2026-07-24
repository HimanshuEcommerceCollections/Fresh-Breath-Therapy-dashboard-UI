// src/lib/permissions.ts
//
// Role-gating rules per FBT_Backend_API_Reference.docx section 1.3 and the
// Full Permission Matrix (section 16). Keep these as the single source of
// truth for "can this role do X" — pages/components should call these
// rather than comparing role strings inline.

import type { RoleName } from "@/src/services/authService";

// Section 1.3: "Therapist: Read-only everywhere ... own records only."
export function canWrite(role: RoleName | null): boolean {
  return role === "Admin" || role === "Coordinator";
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
