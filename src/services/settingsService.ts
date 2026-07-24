// src/services/settingsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 14
// (Organization, Roles, Feature Flags, Integrations — Packages already live
// in packagesService.ts, extended here with create/update/delete).
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
// - Integration has no `description` field in the real API — kept as fixed
//   local copy keyed by name, same reasoning as Roles above.

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

// ---- Feature Flags --------------------------------------------------------

export type FeatureFlagCategory = "automation" | "notification" | "saas" | "security";

export interface FeatureFlag {
  id: string;
  category: FeatureFlagCategory;
  key: string;
  label: string;
  enabled: boolean;
}

export const featureFlagsService = {
  async fetchFlags(category: FeatureFlagCategory): Promise<FeatureFlag[]> {
    const res = await apiClient.get<FeatureFlag[]>("/api/settings/feature-flags", {
      params: { category },
    });
    return res.data;
  },

  async setEnabled(flagId: string, enabled: boolean): Promise<FeatureFlag> {
    const res = await apiClient.patch<FeatureFlag>(`/api/settings/feature-flags/${flagId}`, { enabled });
    return res.data;
  },
};

// ---- Integrations -----------------------------------------------------

export type IntegrationStatus = "Connected" | "Available";

export interface Integration {
  id: string;
  name: string;
  status: IntegrationStatus;
  connectedAt: string | null;
}

interface ApiIntegration {
  id: string;
  name: string;
  status: "connected" | "available";
  connected_at: string | null;
}

function toIntegration(raw: ApiIntegration): Integration {
  return {
    id: raw.id,
    name: raw.name,
    status: raw.status === "connected" ? "Connected" : "Available",
    connectedAt: raw.connected_at,
  };
}

export const integrationsService = {
  async fetchIntegrations(): Promise<Integration[]> {
    const res = await apiClient.get<ApiIntegration[]>("/api/settings/integrations");
    return res.data.map(toIntegration);
  },

  async connect(integrationId: string, credentials?: Record<string, string>): Promise<Integration> {
    const res = await apiClient.post<ApiIntegration>(
      `/api/settings/integrations/${integrationId}/connect`,
      { credentials }
    );
    return toIntegration(res.data);
  },

  async disconnect(integrationId: string): Promise<Integration> {
    const res = await apiClient.post<ApiIntegration>(`/api/settings/integrations/${integrationId}/disconnect`);
    return toIntegration(res.data);
  },
};

export type { ServicePackage };
