// TODO: replace with backend-fetched settings (/api/settings/security).
export type SecuritySetting = { id: string; label: string; enabled: boolean };

export const securitySettingsData: SecuritySetting[] = [
  { id: "1", label: "Require MFA for Admins", enabled: true },
  { id: "2", label: "HIPAA audit logging", enabled: true },
  { id: "3", label: "Auto-logout after 30 min idle", enabled: true },
  { id: "4", label: "7-year data retention", enabled: true },
];
