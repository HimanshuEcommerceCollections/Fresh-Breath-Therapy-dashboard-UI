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
