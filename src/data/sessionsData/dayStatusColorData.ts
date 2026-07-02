import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";

// Colored status pills for the Day view (distinct from the List view's plain
// bordered dropdown). "No Show" wasn't present in the reference day's data —
// ASSUMED to match Cancelled's neutral-gray treatment (same "session didn't
// happen" semantic); correct if the design shows a distinct color for it.
export const dayStatusColorData: Record<
  SessionStatus,
  { bg: string; border: string; text: string }
> = {
  Scheduled: {
    bg: "rgba(43, 127, 255, 0.15)",
    border: "rgba(43, 127, 255, 0.3)",
    text: "#1447E6",
  },
  Completed: {
    bg: "rgba(0, 188, 125, 0.15)",
    border: "rgba(0, 188, 125, 0.3)",
    text: "#007A55",
  },
  Cancelled: {
    bg: "rgba(98, 116, 142, 0.15)",
    border: "rgba(98, 116, 142, 0.3)",
    text: "#314158",
  },
  Rescheduled: {
    bg: "rgba(254, 154, 0, 0.15)",
    border: "rgba(254, 154, 0, 0.3)",
    text: "#BB4D00",
  },
  "No Show": {
    bg: "rgba(98, 116, 142, 0.15)",
    border: "rgba(98, 116, 142, 0.3)",
    text: "#314158",
  },
};
