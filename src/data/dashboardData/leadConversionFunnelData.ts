export type FunnelStage = {
  stage: string; // "New Lead" | "Contacted" | "Consult Scheduled" |
  // "Consult Completed" | "Therapy Session Booked" | "Ongoing Therapy"
  value: number;
};

// TODO: replace with backend-fetched pipeline distribution.
export const leadConversionFunnelData: FunnelStage[] = [
  { stage: "New Lead", value: 5 },
  { stage: "Contacted", value: 4 },
  { stage: "Consult Scheduled", value: 6 },
  { stage: "Consult Completed", value: 4 },
  { stage: "Therapy Session Booked", value: 1 },
  { stage: "Ongoing Therapy", value: 5 },
];
