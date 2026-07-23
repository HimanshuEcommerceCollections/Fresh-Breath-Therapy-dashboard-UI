// src/services/locationsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 5.
// No endpoint here supports Idempotency-Key per the docs.

import { apiClient } from "@/src/lib/apiClient";

export interface Location {
  id: string;
  name: string;
}

export const locationsService = {
  async fetchLocations(): Promise<Location[]> {
    const res = await apiClient.get<Location[]>("/api/locations");
    return res.data;
  },

  async createLocation(name: string): Promise<Location> {
    const res = await apiClient.post<Location>("/api/locations", { name });
    return res.data;
  },

  async deleteLocation(locationId: string): Promise<void> {
    await apiClient.delete(`/api/locations/${locationId}`);
  },
};
