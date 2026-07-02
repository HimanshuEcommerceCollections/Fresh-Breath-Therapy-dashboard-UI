import type { LeadStatus } from "@/src/data/leadsData/leadsData";

// UI-only presentation config for the pipeline board columns — not backend
// data. "Completed Program" and "Inactive Client" intentionally have no
// column; the pipeline tracks only the 6 active funnel stages.
export type PipelineStageConfig = {
  status: LeadStatus;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
};

export const pipelineStages: PipelineStageConfig[] = [
  {
    status: "New Lead",
    label: "New Lead",
    badgeBg: "rgba(43, 127, 255, 0.15)",
    badgeBorder: "rgba(43, 127, 255, 0.3)",
    badgeText: "#1447E6",
  },
  {
    status: "Contacted",
    label: "Contacted",
    badgeBg: "rgba(0, 184, 219, 0.15)",
    badgeBorder: "rgba(0, 184, 219, 0.3)",
    badgeText: "#007595",
  },
  {
    status: "Consultation Scheduled",
    label: "Consultation Scheduled",
    badgeBg: "rgba(97, 95, 255, 0.15)",
    badgeBorder: "rgba(97, 95, 255, 0.3)",
    badgeText: "#432DD7",
  },
  {
    status: "Consultation Completed",
    label: "Consultation Completed",
    badgeBg: "rgba(142, 81, 255, 0.15)",
    badgeBorder: "rgba(142, 81, 255, 0.3)",
    badgeText: "#7008E7",
  },
  {
    status: "Therapy Session Booked",
    label: "Therapy Session Booked",
    badgeBg: "rgba(173, 70, 255, 0.15)",
    badgeBorder: "rgba(173, 70, 255, 0.3)",
    badgeText: "#8200DB",
  },
  {
    status: "Ongoing Therapy",
    label: "Ongoing Therapy",
    badgeBg: "rgba(0, 188, 125, 0.15)",
    badgeBorder: "rgba(0, 188, 125, 0.3)",
    badgeText: "#007A55",
  },
];
