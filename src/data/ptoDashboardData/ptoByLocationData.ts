// Feeds the "PTO Accrued by Location" bar chart.
// TODO: replace with backend-fetched per-location PTO totals.
export type PTOLocationPoint = { location: string; ptoHours: number };

export const ptoByLocationData: PTOLocationPoint[] = [
  { location: "Cary", ptoHours: 41.68 },
  { location: "Winston-Salem", ptoHours: 0.16 },
  { location: "Greensboro", ptoHours: 30.8 },
  { location: "Raleigh", ptoHours: 7.2 },
  { location: "Fayetteville", ptoHours: 18.96 },
  { location: "Wilmington", ptoHours: 34.88 },
];
