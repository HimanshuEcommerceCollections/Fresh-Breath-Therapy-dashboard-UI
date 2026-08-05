// src/hooks/usePackagesSettings.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  packagesService,
  type PackagePayload,
} from "@/src/services/packagesService";
import { usePackages } from "@/src/hooks/usePackages";
import { showSuccessToast } from "@/src/lib/toast";

export const usePackagesSettings = () => {
  const queryClient = useQueryClient();
  const { packages, isLoading } = usePackages();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["packages"] });

  const createMutation = useMutation({
    mutationFn: (payload: PackagePayload) => packagesService.createPackage(payload),
    onSuccess: () => {
      showSuccessToast("Package created");
      invalidate();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ packageId, payload }: { packageId: string; payload: Partial<PackagePayload> }) =>
      packagesService.updatePackage(packageId, payload),
    onSuccess: () => {
      showSuccessToast("Package updated");
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (packageId: string) => packagesService.deletePackage(packageId),
    onSuccess: () => {
      showSuccessToast("Package deleted");
      invalidate();
    },
  });

  const createPackage = async (payload: PackagePayload) => {
    await createMutation.mutateAsync(payload);
  };

  const updatePackage = async (packageId: string, payload: Partial<PackagePayload>) => {
    await updateMutation.mutateAsync({ packageId, payload });
  };

  const deletePackage = async (packageId: string) => {
    await deleteMutation.mutateAsync(packageId);
  };

  return {
    packages,
    isLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    createPackage,
    updatePackage,
    deletePackage,
  };
};
