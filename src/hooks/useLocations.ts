// src/hooks/useLocations.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { locationsService, type Location } from "@/src/services/locationsService";
import { showSuccessToast } from "@/src/lib/toast";

// Shared real locations list — replaces the half-dozen independent hardcoded
// city-name string arrays scattered across therapists/leads/clients/settings.
// Any dropdown that needs {id, name} locations should use this hook.
export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await locationsService.fetchLocations();
      setLocations(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createLocation = async (name: string) => {
    const location = await locationsService.createLocation(name);
    showSuccessToast("Location created");
    setLocations((prev) => [...prev, location]);
    return location;
  };

  const deleteLocation = async (locationId: string) => {
    await locationsService.deleteLocation(locationId);
    showSuccessToast("Location deleted");
    setLocations((prev) => prev.filter((l) => l.id !== locationId));
  };

  return { locations, isLoading, refetch, createLocation, deleteLocation };
};
