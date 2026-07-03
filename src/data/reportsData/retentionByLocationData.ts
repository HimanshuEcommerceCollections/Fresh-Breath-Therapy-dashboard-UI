// TODO: replace with backend-fetched retention (/api/reports/retention).
export type LocationRetention = { location: string; months: number };

export const retentionByLocationData: LocationRetention[] = [
  { location: "Cary", months: 22 },
  { location: "Winston-Salem", months: 12 },
  { location: "Greensboro", months: 21 },
  { location: "Raleigh", months: 0 },
  { location: "Fayetteville", months: 0 },
  { location: "Wilmington", months: 0 },
];
