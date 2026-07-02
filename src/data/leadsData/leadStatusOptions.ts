import type { LeadStatus } from "@/src/data/leadsData/leadsData";

// TODO: may come from the backend eventually alongside leads.
export const leadStatusOptions: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Consultation Scheduled",
  "Consultation Completed",
  "Therapy Session Booked",
  "Ongoing Therapy",
  "Completed Program",
  "Inactive Client",
];
