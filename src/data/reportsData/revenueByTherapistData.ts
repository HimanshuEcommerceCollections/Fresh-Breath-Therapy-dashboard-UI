// TODO: replace with backend-fetched revenue breakdown (/api/reports/revenue).
// NOTE (per spec): these values are PLACEHOLDERS — the exact bar heights
// should be transcribed visually from the "Revenue by Therapist" reference
// screenshot against its 0/350/700/1050/1400 gridlines. The screenshot
// wasn't attached, so these spec-provided numbers are used as-is until then.
export type TherapistRevenue = { name: string; revenue: number };

export const revenueByTherapistData: TherapistRevenue[] = [
  { name: "Monica", revenue: 0 },
  { name: "Kailyn", revenue: 0 },
  { name: "Kaylee", revenue: 600 },
  { name: "Catherine", revenue: 100 },
  { name: "Jordan", revenue: 1300 },
  { name: "Tracey", revenue: 600 },
  { name: "Linda", revenue: 0 },
  { name: "Raven", revenue: 0 },
  { name: "Naja", revenue: 200 },
  { name: "Jaimy", revenue: 800 },
  { name: "Ashley", revenue: 1100 },
  { name: "Katina", revenue: 100 },
  { name: "Lisa", revenue: 0 },
  { name: "Lauren", revenue: 500 },
  { name: "Natalie", revenue: 0 },
  { name: "Yeshira", revenue: 0 },
  { name: "Katrina", revenue: 200 },
  { name: "Shelby", revenue: 0 },
];
