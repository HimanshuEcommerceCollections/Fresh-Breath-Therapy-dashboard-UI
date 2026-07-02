import type { FollowUpStatus } from "@/src/data/followUpsData/followUpsData";

// Completed and Pending intentionally match the Sessions Day view's
// "Completed" and "Rescheduled" pill colors (dayStatusColorData).
export const statusColorData: Record<
  FollowUpStatus,
  { bg: string; border: string; text: string }
> = {
  Completed: {
    bg: "rgba(0, 188, 125, 0.15)",
    border: "rgba(0, 188, 125, 0.3)",
    text: "#007A55",
  },
  Overdue: {
    bg: "rgba(251, 44, 54, 0.15)",
    border: "rgba(251, 44, 54, 0.3)",
    text: "#C10007",
  },
  Pending: {
    bg: "rgba(254, 154, 0, 0.15)",
    border: "rgba(254, 154, 0, 0.3)",
    text: "#BB4D00",
  },
};
