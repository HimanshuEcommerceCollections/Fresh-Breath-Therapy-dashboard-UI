// TODO: replace with backend-fetched modules (/api/settings/saas).
export type SaaSModule = { id: string; label: string; enabled: boolean };

export const saasModulesData: SaaSModule[] = [
  { id: "1", label: "Multi-Clinic Support (active)", enabled: true },
  { id: "2", label: "Client Portal — self-booking & invoices", enabled: false },
  { id: "3", label: "Therapist Mobile Portal", enabled: false },
  { id: "4", label: "WhatsApp Integration", enabled: false },
  { id: "5", label: "Online Booking Widget", enabled: false },
  { id: "6", label: "Subscription Billing (Stripe)", enabled: false },
  { id: "7", label: "AI Follow-Up Recommendations", enabled: false },
];
