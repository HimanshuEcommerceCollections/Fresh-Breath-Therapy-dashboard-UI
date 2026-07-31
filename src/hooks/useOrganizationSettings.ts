// src/hooks/useOrganizationSettings.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/src/services/settingsService";
import { showSuccessToast } from "@/src/lib/toast";

export const useOrganizationSettings = () => {
  const queryClient = useQueryClient();

  const { data: organization = null, isLoading } = useQuery({
    queryKey: ["organization"],
    queryFn: () => organizationService.fetchOrganization(),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: { name: string; primaryEmail: string; timezone: string }) =>
      organization
        ? organizationService.updateOrganization(payload)
        : organizationService.createOrganization(payload),
    onSuccess: () => {
      showSuccessToast("Organization settings saved");
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });

  const save = async (payload: { name: string; primaryEmail: string; timezone: string }) => {
    await saveMutation.mutateAsync(payload);
  };

  return { organization, isLoading, isSaving: saveMutation.isPending, save };
};
