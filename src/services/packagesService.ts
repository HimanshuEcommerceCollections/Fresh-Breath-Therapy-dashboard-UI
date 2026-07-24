// src/services/packagesService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section
// 14.3. The read was already used by Payments' Record Payment modal;
// create/update/delete are added here for the Settings integration step.
//
// Note: PackagesSettings.tsx currently renders packages as plain
// non-interactive cards with no add/edit/delete buttons anywhere in the
// existing design — create/update/delete are exposed here for future use
// but no CRUD UI is built, since there's no mockup to follow and inventing
// one wasn't part of replacing existing mock data with real calls.

import { apiClient } from "@/src/lib/apiClient";

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface PackagePayload {
  name: string;
  price: number;
  isActive?: boolean;
}

interface ApiPackage {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
}

function toServicePackage(raw: ApiPackage): ServicePackage {
  return { id: raw.id, name: raw.name, price: raw.price, isActive: raw.is_active };
}

export const packagesService = {
  async fetchPackages(): Promise<ServicePackage[]> {
    const res = await apiClient.get<ApiPackage[]>("/api/settings/packages");
    return res.data.map(toServicePackage);
  },

  async createPackage(payload: PackagePayload): Promise<ServicePackage> {
    const res = await apiClient.post<ApiPackage>("/api/settings/packages", {
      name: payload.name,
      price: payload.price,
      is_active: payload.isActive,
    });
    return toServicePackage(res.data);
  },

  async updatePackage(packageId: string, payload: Partial<PackagePayload>): Promise<ServicePackage> {
    const res = await apiClient.patch<ApiPackage>(`/api/settings/packages/${packageId}`, {
      name: payload.name,
      price: payload.price,
      is_active: payload.isActive,
    });
    return toServicePackage(res.data);
  },

  async deletePackage(packageId: string): Promise<void> {
    await apiClient.delete(`/api/settings/packages/${packageId}`);
  },
};
