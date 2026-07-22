import type { LeadStatus } from "@/src/data/leadsData/leadsData";

// Static badge colors for the Lead Search view (Clients page). Distinct from
// pipelineStageConfig's rgba badges used on the Leads pipeline board — these
// are the solid pastel colors from the Lead Search design spec. "Consultation
// Scheduled" is displayed as "Consultation Booked" per that spec. Statuses
// past the active funnel (Ongoing Therapy and beyond) fall back to a neutral
// pill since a lead search shouldn't surface those, but the color exists in
// case filtering ever changes.
export const leadStatusBadgeColors: Record<
  LeadStatus,
  { bg: string; text: string; label: string }
> = {
  "New Lead": { bg: "#DCF4FF", text: "#2C7EA1", label: "New Lead" },
  Contacted: { bg: "#FFEDD5", text: "#9A611D", label: "Contacted" },
  "Consultation Scheduled": {
    bg: "#F3E8FF",
    text: "#7C3AED",
    label: "Consultation Booked",
  },
  "Consultation Completed": { bg: "#F3E8FF", text: "#7C3AED", label: "Consultation Booked" },
  "Therapy Session Booked": { bg: "#DCFCE7", text: "#15803D", label: "Therapy Session Booked" },
  "Ongoing Therapy": { bg: "#DCFCE7", text: "#15803D", label: "Ongoing Therapy" },
  "Completed Program": { bg: "#E2E8F0", text: "#475569", label: "Completed Program" },
  "Inactive Client": { bg: "#E2E8F0", text: "#475569", label: "Inactive Client" },
};
