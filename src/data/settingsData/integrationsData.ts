// TODO: replace with backend-fetched integrations (/api/settings/integrations).
export type IntegrationStatus = "Connected" | "Available";

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  actionLabel: string; // "Configure" if connected, "Connect" if available
};

export const integrationsData: Integration[] = [
  { id: "1", name: "Grasshopper", description: "Call logging & missed-call lead capture", status: "Connected", actionLabel: "Configure" },
  { id: "2", name: "Twilio SMS", description: "Appointment reminders & broadcasts", status: "Connected", actionLabel: "Configure" },
  { id: "3", name: "WhatsApp Business", description: "Two-way client messaging", status: "Available", actionLabel: "Connect" },
  { id: "4", name: "Stripe", description: "Card payments & invoicing", status: "Available", actionLabel: "Connect" },
  { id: "5", name: "Google Calendar", description: "Therapist calendar sync", status: "Available", actionLabel: "Connect" },
];
