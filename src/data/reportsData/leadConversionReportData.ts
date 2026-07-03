// TODO: replace with backend-fetched conversion report (/api/reports/conversion).
export type ConversionStage = { stage: string; count: number; percent: number };

export const overallConversionRate = 36; // percent

export const leadConversionReportData: ConversionStage[] = [
  { stage: "New Lead", count: 5, percent: 12 },
  { stage: "Contacted", count: 4, percent: 10 },
  { stage: "Consultation Scheduled", count: 6, percent: 14 },
  { stage: "Consultation Completed", count: 4, percent: 10 },
  { stage: "Therapy Session Booked", count: 1, percent: 2 },
  { stage: "Ongoing Therapy", count: 5, percent: 12 },
  { stage: "Completed Program", count: 10, percent: 24 },
  { stage: "Inactive Client", count: 7, percent: 17 },
];
