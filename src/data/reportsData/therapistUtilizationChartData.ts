// Standalone utilization bar chart data (distinct from the Dashboard's
// utilization section — these are avg-sessions/week-style values, not %).
// TODO: replace with backend-fetched utilization (/api/reports/utilization).
export type UtilizationPoint = { name: string; value: number };

export const therapistUtilizationChartData: UtilizationPoint[] = [
  { name: "Kaylee", value: 6.3 },
  { name: "Naja", value: 3.1 },
  { name: "Jaimy", value: 2.9 },
  { name: "Katina", value: 2 },
  { name: "Lauren", value: 0.5 },
  { name: "Linda", value: 4.7 },
  { name: "Yeshira", value: 0.3 },
  { name: "Katrina", value: 0.1 },
  { name: "Monica", value: 9 },
  { name: "Tracey", value: 5.5 },
  { name: "Raven", value: 3.4 },
  { name: "Jordan", value: 5.9 },
  { name: "Ashley", value: 2.7 },
  { name: "Natalie", value: 0.6 },
  { name: "Catherine", value: 6.2 },
  { name: "Kailyn", value: 8.4 },
  { name: "Shelby", value: 0.1 },
  { name: "Lisa", value: 2.7 },
];
