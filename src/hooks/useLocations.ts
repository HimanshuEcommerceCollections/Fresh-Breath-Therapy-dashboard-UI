// src/hooks/useLocations.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { locationsService } from "@/src/services/locationsService";
import { showSuccessToast } from "@/src/lib/toast";

// Shared real locations list — replaces the half-dozen independent hardcoded
// city-name string arrays scattered across therapists/leads/clients/settings.
// Any dropdown that needs {id, name} locations should use this hook.
export const useLocations = () => {
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading, refetch } = useQuery({
    queryKey: ["locations"],
    queryFn: () => locationsService.fetchLocations(),
  });

  const createLocationMutation = useMutation({
    mutationFn: (name: string) => locationsService.createLocation(name),
    onSuccess: () => {
      showSuccessToast("Location created");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: (locationId: string) => locationsService.deleteLocation(locationId),
    onSuccess: () => {
      showSuccessToast("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  return {
    locations,
    isLoading,
    refetch,
    createLocation: createLocationMutation.mutateAsync,
    deleteLocation: deleteLocationMutation.mutateAsync,
  };
};
