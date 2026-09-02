// Status → pill colours, for every place a status is rendered: the leads table
// dropdown, the pipeline board columns, the clients pill and the Lead Search
// badges.
//
// ONE palette, where there used to be three. leadStatusBadgeColors (solid
// pastels), statusColorData (rgba + border) and pipelineStageConfig (its own
// rgba) each kept a separate colour per status, so the same status rendered
// three different colours depending on which screen you were looking at, and
// adding a status meant remembering all three files.
//
// The rgba-with-border style wins because two of the three already used it and
// it sits better on the white table rows.

import type { ContactStatus } from "@/src/data/leadsData/contactStatus";

export type StatusColors = { bg: string; border: string; text: string };

export const contactStatusColors: Record<ContactStatus, StatusColors> = {
  // Cool blues for the early, unworked end of the pipeline...
  "New Lead": {
    bg: "rgba(43, 127, 255, 0.15)",
    border: "rgba(43, 127, 255, 0.3)",
    text: "#1447E6",
  },
  Contacted: {
    bg: "rgba(0, 184, 219, 0.15)",
    border: "rgba(0, 184, 219, 0.3)",
    text: "#007595",
  },
  "Follow-Up": {
    bg: "rgba(97, 95, 255, 0.15)",
    border: "rgba(97, 95, 255, 0.3)",
    text: "#432DD7",
  },
  // ...amber for the two "we are blocked, waiting on someone" stages, so they
  // read as needing attention rather than as forward progress.
  "Awaiting Client Response": {
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.3)",
    text: "#B45309",
  },
  "Awaiting Therapist/Insurance Confirmation": {
    bg: "rgba(217, 119, 6, 0.15)",
    border: "rgba(217, 119, 6, 0.3)",
    text: "#92400E",
  },
  // ...purple then green as it converts into actual care.
  Booked: {
    bg: "rgba(142, 81, 255, 0.15)",
    border: "rgba(142, 81, 255, 0.3)",
    text: "#7008E7",
  },
  "Ongoing Therapy": {
    bg: "rgba(0, 188, 125, 0.15)",
    border: "rgba(0, 188, 125, 0.3)",
    text: "#007A55",
  },
  // Neutral: closed is not a failure state, it is simply not active.
  "Closed/Inactive": {
    bg: "rgba(100, 116, 139, 0.15)",
    border: "rgba(100, 116, 139, 0.3)",
    text: "#475569",
  },
};
