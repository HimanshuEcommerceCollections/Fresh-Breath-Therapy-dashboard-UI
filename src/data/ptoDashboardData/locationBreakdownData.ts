// Feeds the right-side Location Breakdown list (same 6 locations as the bar
// chart, richer detail). TODO: replace with backend-fetched breakdown.
export type LocationBreakdown = {
  location: string;
  therapistCount: number;
  sessions: number;
  ptoHours: number;
};

export const locationBreakdownData: LocationBreakdown[] = [
  { location: "Cary", therapistCount: 7, sessions: 1042, ptoHours: 41.68 },
  { location: "Winston-Salem", therapistCount: 1, sessions: 4, ptoHours: 0.16 },
  { location: "Greensboro", therapistCount: 2, sessions: 770, ptoHours: 30.8 },
  { location: "Raleigh", therapistCount: 1, sessions: 180, ptoHours: 7.2 },
  { location: "Fayetteville", therapistCount: 3, sessions: 474, ptoHours: 18.96 },
  { location: "Wilmington", therapistCount: 4, sessions: 872, ptoHours: 34.88 },
];
