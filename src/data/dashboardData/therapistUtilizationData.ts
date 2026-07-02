export type TherapistUtilization = {
  id: string;
  name: string;
  city: string;
  sessionsCount: number;
  ptoHours: number;
};

// TODO: replace with backend-fetched therapist utilization stats.
// Bar fill percentages are derived at render time from the max sessionsCount
// in this list — they are intentionally not stored here.
export const therapistUtilizationData: TherapistUtilization[] = [
  { id: "1", name: "Monica Joyce", city: "Greensboro", sessionsCount: 476, ptoHours: 19.04 },
  { id: "2", name: "Kailyn Mattingly", city: "Wilmington", sessionsCount: 446, ptoHours: 17.84 },
  { id: "3", name: "Kaylee Meyers", city: "Cary", sessionsCount: 332, ptoHours: 13.28 },
  { id: "4", name: "Catherine (Cay) Fulop", city: "Wilmington", sessionsCount: 329, ptoHours: 13.16 },
  { id: "5", name: "Jordan Schultz", city: "Fayetteville", sessionsCount: 314, ptoHours: 12.56 },
];
