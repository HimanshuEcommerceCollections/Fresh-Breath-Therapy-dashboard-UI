// src/hooks/useOrganizationSettings.ts
"use client";

import { useEffect, useState } from "react";
import { organizationService, type Organization } from "@/src/services/settingsService";
import { showSuccessToast } from "@/src/lib/toast";

export const useOrganizationSettings = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    organizationService
      .fetchOrganization()
      .then((org) => {
        if (isMounted) setOrganization(org);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const save = async (payload: { name: string; primaryEmail: string; timezone: string }) => {
    setIsSaving(true);
    try {
      const result = organization
        ? await organizationService.updateOrganization(payload)
        : await organizationService.createOrganization(payload);
      setOrganization(result);
      showSuccessToast("Organization settings saved");
    } finally {
      setIsSaving(false);
    }
  };

  return { organization, isLoading, isSaving, save };
};
