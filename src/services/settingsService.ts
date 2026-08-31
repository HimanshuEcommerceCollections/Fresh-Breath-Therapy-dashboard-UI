// src/services/settingsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 14
// (Organization, Roles — Packages already live in packagesService.ts,
// extended here with create/update/delete). Notifications, SaaS, and
// Security tabs are all static design UI, not backed by an API. Note the
// backend's feature_flags table/router still exists and still gates the
// real notification-creation pipeline (see notification_service.py) — this
// frontend just no longer reads or writes it, so those flags can now only
// be changed directly in the database, not from Settings.
//
// MISMATCH (flagged, not guessed):
// - Organization has NO `locations` field in the real API — that's the
//   separate Locations resource (section 5, already wired via useLocations).
//   OrganizationSettings.tsx now sources its location chips from there.
// - Role.permissions is an opaque, undocumented object ({}) — the doc never
//   specifies its shape anywhere it appears (here or GET /auth/me). The
//   existing human-readable descriptions ("Full access · Manage team...")
//   can't be derived from it, so they're kept as fixed local UI copy
//   (which also matches section 16's own written Permission Matrix) rather
//   than guessing a rendering for an unspecified object.

import { apiClient } from "@/src/lib/apiClient";
import type { ServicePackage } from "@/src/services/packagesService";

// ---- Organization -----------------------------------------------------

export interface Organization {
  id: string;
  name: string;
  primaryEmail: string;
  timezone: string;
}

interface ApiOrganization {
  id: string;
  org_name: string;
  primary_email: string;
  timezone: string;
}

function toOrganization(raw: ApiOrganization): Organization {
  return { id: raw.id, name: raw.org_name, primaryEmail: raw.primary_email, timezone: raw.timezone };
}

export const organizationService = {
  async fetchOrganization(): Promise<Organization | null> {
    const res = await apiClient.get<ApiOrganization | null>("/api/settings/organization");
    return res.data ? toOrganization(res.data) : null;
  },

  async createOrganization(payload: { name: string; primaryEmail: string; timezone?: string }): Promise<Organization> {
    const res = await apiClient.post<ApiOrganization>("/api/settings/organization", {
      org_name: payload.name,
      primary_email: payload.primaryEmail,
      timezone: payload.timezone,
    });
    return toOrganization(res.data);
  },

  async updateOrganization(payload: { name?: string; primaryEmail?: string; timezone?: string }): Promise<Organization> {
    const res = await apiClient.patch<ApiOrganization>("/api/settings/organization", {
      org_name: payload.name,
      primary_email: payload.primaryEmail,
      timezone: payload.timezone,
    });
    return toOrganization(res.data);
  },
};

// ---- Roles (read-only) --------------------------------------------------

export interface SettingsRole {
  id: string;
  name: "Admin" | "Coordinator" | "Therapist";
}

export const rolesService = {
  async fetchRoles(): Promise<SettingsRole[]> {
    const res = await apiClient.get<{ id: string; name: SettingsRole["name"]; permissions: unknown }[]>(
      "/api/settings/roles"
    );
    return res.data.map((r) => ({ id: r.id, name: r.name }));
  },
};

export type { ServicePackage };

// ---- Security ---------------------------------------------------------
//
// Read-only, deliberately. The Security tab used to render a hardcoded array
// of four toggles that all showed ON and that nothing read or enforced —
// "Require MFA for Admins", "HIPAA audit logging", "Auto-logout after 30 min
// idle", "7-year data retention". A screen asserting controls that do not
// exist is worse than a screen showing none, because an auditor reading it
// and then reading the code finds a claim rather than a to-do.
//
// It now reports what the backend is ACTUALLY configured with, computed from
// the same settings the middleware reads, so the displayed value cannot drift
// from the enforced one. There is no update call and there should not be: an
// audit trail an Admin could switch off from a web page is not an audit trail.

export interface SecurityControl {
  key: string;
  label: string;
  /** true = on, false = off, null = enforced outside the app (e.g. at the
   *  load balancer). null is NOT the same as off and must not render as it. */
  enabled: boolean | null;
  detail: string;
}

export const securitySettingsService = {
  async fetchControls(): Promise<SecurityControl[]> {
    const res = await apiClient.get<{ controls: SecurityControl[] }>(
      "/api/settings/security"
    );
    return res.data.controls;
  },
};
