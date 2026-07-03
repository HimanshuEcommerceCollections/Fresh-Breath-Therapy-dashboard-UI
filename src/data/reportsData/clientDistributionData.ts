// TODO: replace with backend-fetched distribution (/api/reports/clients).
export type ClientStatusCount = { status: string; count: number };

export const clientDistributionData: ClientStatusCount[] = [
  { status: "New Lead", count: 5 },
  { status: "Contacted", count: 4 },
  { status: "Consultation Scheduled", count: 6 },
  { status: "Consultation Completed", count: 4 },
  { status: "Therapy Session Booked", count: 1 },
  { status: "Ongoing Therapy", count: 5 },
  { status: "Completed Program", count: 10 },
  { status: "Inactive Client", count: 7 },
];
