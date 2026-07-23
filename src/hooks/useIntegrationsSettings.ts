// src/hooks/useIntegrationsSettings.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { integrationsService, type Integration } from "@/src/services/settingsService";
import { showSuccessToast } from "@/src/lib/toast";

export const useIntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await integrationsService.fetchIntegrations();
      setIntegrations(data);
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Section 14.5: "Connect" and "Configure" share the same endpoint — the
  // button label just reflects current status client-side. There's no
  // disconnect button anywhere in the current design, so disconnect() is
  // exposed on the service but not wired to any UI here.
  const connect = async (integrationId: string) => {
    const updated = await integrationsService.connect(integrationId);
    showSuccessToast(`${updated.name} connected`);
    setIntegrations((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  return { integrations, isLoading, connect };
};
