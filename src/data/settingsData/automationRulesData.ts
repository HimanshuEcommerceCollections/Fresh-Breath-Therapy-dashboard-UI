// TODO: replace with backend-fetched rules (/api/settings/automation).
export type AutomationRule = { id: string; label: string; enabled: boolean };

export const automationRulesData: AutomationRule[] = [
  { id: "1", label: "Send SMS reminder 24h before session", enabled: true },
  { id: "2", label: "Send SMS reminder 2h before session", enabled: true },
  { id: "3", label: "Auto-create follow-up on No Show", enabled: true },
  { id: "4", label: "Send payment reminder 3 days before due", enabled: true },
  { id: "5", label: "Escalate overdue follow-ups after 24h", enabled: true },
  { id: "6", label: "Reactivation campaign at 60 days inactive", enabled: true },
];
