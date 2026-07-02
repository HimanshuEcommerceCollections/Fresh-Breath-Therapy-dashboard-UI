import type { ClientStatus } from "@/src/data/clientsData/clientsData";

// Status → pill colors, applied as inline style (arbitrary rgba values) —
// same pattern as the session/follow-up status pills.
export const statusColorData: Record<
  ClientStatus,
  { bg: string; border: string; text: string }
> = {
  "Consultation Completed": {
    bg: "rgba(142, 81, 255, 0.15)",
    border: "rgba(142, 81, 255, 0.3)",
    text: "#7008E7",
  },
  "Ongoing Therapy": {
    bg: "rgba(0, 188, 125, 0.15)",
    border: "rgba(0, 188, 125, 0.3)",
    text: "#007A55",
  },
  "Completed Program": {
    bg: "rgba(0, 187, 167, 0.15)",
    border: "rgba(0, 187, 167, 0.3)",
    text: "#00786F",
  },
  "Therapy Session Booked": {
    bg: "rgba(173, 70, 255, 0.15)",
    border: "rgba(173, 70, 255, 0.3)",
    text: "#8200DB",
  },
};
