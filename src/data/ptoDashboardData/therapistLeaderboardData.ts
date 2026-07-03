export type LeaderboardEntry = {
  rank: number;
  name: string;
  credential: string;
  location: string;
  ytdSessions: number;
  ptoAccrued: number;
  ptoUsed: number;
  balance: number;
  avgPerWeek: number;
};

// TODO: replace with backend-fetched leaderboard (/api/pto-leaderboard).
// Rows 1–2 are exact from the spec; ranks 3–5 and 9 use values already
// established for those therapists elsewhere (therapists page / dashboard).
// The rest are PLACEHOLDERS pending exact transcription from the reference
// screenshot — names preserve the reference's rank order (sorted by balance
// descending), values follow the 0.04h-per-session accrual rule, and the
// ytdSessions total is exactly 3,342 so PTO totals sum to 133.68h, matching
// the stat cards. Ranks 6–18 won't reconcile with therapistsData's own
// placeholder ytd/pto values until both are transcribed from the reference.
export const therapistLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Monica Joyce", credential: "LCMHCA", location: "Greensboro", ytdSessions: 476, ptoAccrued: 19.04, ptoUsed: 0, balance: 19.04, avgPerWeek: 9 },
  { rank: 2, name: "Kailyn Mattingly", credential: "LCSWA", location: "Wilmington", ytdSessions: 446, ptoAccrued: 17.84, ptoUsed: 0, balance: 17.84, avgPerWeek: 8.4 },
  { rank: 3, name: "Kaylee Meyers", credential: "LCSW", location: "Cary", ytdSessions: 332, ptoAccrued: 13.28, ptoUsed: 0, balance: 13.28, avgPerWeek: 6.3 },
  { rank: 4, name: "Catherine (Cay) Fulop", credential: "LCMHC", location: "Wilmington", ytdSessions: 329, ptoAccrued: 13.16, ptoUsed: 0, balance: 13.16, avgPerWeek: 6.2 },
  { rank: 5, name: "Jordan Schultz", credential: "LMFTA", location: "Fayetteville", ytdSessions: 314, ptoAccrued: 12.56, ptoUsed: 0, balance: 12.56, avgPerWeek: 5.9 },
  { rank: 6, name: "Tracey Hagan", credential: "LCMHA", location: "Cary", ytdSessions: 290, ptoAccrued: 11.6, ptoUsed: 0, balance: 11.6, avgPerWeek: 5.5 },
  { rank: 7, name: "Linda McAteer", credential: "LCMHC", location: "Raleigh", ytdSessions: 262, ptoAccrued: 10.48, ptoUsed: 0, balance: 10.48, avgPerWeek: 4.9 },
  { rank: 8, name: "Raven Armstrong", credential: "LCSW", location: "Raleigh", ytdSessions: 220, ptoAccrued: 8.8, ptoUsed: 0, balance: 8.8, avgPerWeek: 4.2 },
  { rank: 9, name: "Naja Cotton", credential: "LCSWA", location: "Cary", ytdSessions: 162, ptoAccrued: 6.48, ptoUsed: 0, balance: 6.48, avgPerWeek: 3.1 },
  { rank: 10, name: "Jaimy Summerlin", credential: "LMFTA", location: "Greensboro", ytdSessions: 105, ptoAccrued: 4.2, ptoUsed: 0, balance: 4.2, avgPerWeek: 2 },
  { rank: 11, name: "Ashley Aubas", credential: "LCSWA", location: "Winston-Salem", ytdSessions: 92, ptoAccrued: 3.68, ptoUsed: 0, balance: 3.68, avgPerWeek: 1.7 },
  { rank: 12, name: "Katina Redmond", credential: "LMHCA", location: "Raleigh", ytdSessions: 78, ptoAccrued: 3.12, ptoUsed: 0, balance: 3.12, avgPerWeek: 1.5 },
  { rank: 13, name: "Lisa McCorrmick", credential: "LCSW, LCAS", location: "Winston-Salem", ytdSessions: 66, ptoAccrued: 2.64, ptoUsed: 0, balance: 2.64, avgPerWeek: 1.2 },
  { rank: 14, name: "Lauren Fisher", credential: "LCMHCA", location: "Winston-Salem", ytdSessions: 55, ptoAccrued: 2.2, ptoUsed: 0, balance: 2.2, avgPerWeek: 1 },
  { rank: 15, name: "Natalie Harris", credential: "LMHCA", location: "Fayetteville", ytdSessions: 47, ptoAccrued: 1.88, ptoUsed: 0, balance: 1.88, avgPerWeek: 0.9 },
  { rank: 16, name: "Yeshira Benson", credential: "LCSWA", location: "Winston-Salem", ytdSessions: 38, ptoAccrued: 1.52, ptoUsed: 0, balance: 1.52, avgPerWeek: 0.7 },
  { rank: 17, name: "Katrina McGurie", credential: "LCMHC", location: "Wilmington", ytdSessions: 26, ptoAccrued: 1.04, ptoUsed: 0, balance: 1.04, avgPerWeek: 0.5 },
  { rank: 18, name: "Shelby Paske", credential: "LCMHCA", location: "Greensboro", ytdSessions: 4, ptoAccrued: 0.16, ptoUsed: 0, balance: 0.16, avgPerWeek: 0.1 },
];
