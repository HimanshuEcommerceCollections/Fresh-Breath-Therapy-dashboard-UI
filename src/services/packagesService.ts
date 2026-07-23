// src/services/packagesService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section
// 14.3. Only the read used by Payments' Record Payment modal is
// implemented here for now (Payments needs real package IDs to submit
// POST /api/payments correctly) — full Packages CRUD (create/update/
// delete) is built out during the Settings integration step.

import { apiClient } from "@/src/lib/apiClient";

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
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
};
