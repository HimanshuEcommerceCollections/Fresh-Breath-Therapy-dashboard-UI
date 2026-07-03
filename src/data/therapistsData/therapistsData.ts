export type Therapist = {
  id: string;
  name: string;
  credential: string; // "LCSW", "LCSWA", "LMFTA", "LMHCA", "LCMHCA", "LCMHA", "LCMHC", "LCSW, LCAS"
  location: string; // "Cary", "Winston-Salem", "Greensboro", "Raleigh", "Fayetteville", "Wilmington"
  email: string;
  avatarUrl: string;
  activeClients: number;
  sessionsThisMonth: number;
  revenueThisMonth: number; // whole dollars, displayed as "$0.6k"
  utilizationPercent: number; // 0-100
  ytdSessions: number;
  ptoHours: number;
};

// TODO: replace with backend-fetched therapists (/api/therapists).
// Rows 1–2 are exact from the spec. Rows 3–18 are PLACEHOLDERS pending exact
// transcription from the reference screenshot — names are in the reference's
// order; YTD/PTO values match the Dashboard's therapistUtilizationData where
// those therapists appear (Monica Joyce, Kailyn Mattingly, Jordan Schultz,
// Catherine (Cay) Fulop), and ptoHours follows the ytdSessions × 0.04 pattern
// the two exact rows establish. Avatar paths are placeholders until real
// headshot assets are provided.
export const therapistsData: Therapist[] = [
  { id: "1", name: "Kaylee Meyers", credential: "LCSW", location: "Cary", email: "kaylee@freshbreath.co", avatarUrl: "/therapists/avatars/kaylee.png", activeClients: 0, sessionsThisMonth: 4, revenueThisMonth: 600, utilizationPercent: 79, ytdSessions: 332, ptoHours: 13.28 },
  { id: "2", name: "Naja Cotton", credential: "LCSWA", location: "Cary", email: "naja@freshbreath.co", avatarUrl: "/therapists/avatars/naja.png", activeClients: 0, sessionsThisMonth: 10, revenueThisMonth: 200, utilizationPercent: 39, ytdSessions: 162, ptoHours: 6.48 },
  { id: "3", name: "Jaimy Summerlin", credential: "LMFTA", location: "Greensboro", email: "jaimy@freshbreath.co", avatarUrl: "/therapists/avatars/jaimy.png", activeClients: 3, sessionsThisMonth: 8, revenueThisMonth: 900, utilizationPercent: 62, ytdSessions: 288, ptoHours: 11.52 },
  { id: "4", name: "Katina Redmond", credential: "LMHCA", location: "Raleigh", email: "katina@freshbreath.co", avatarUrl: "/therapists/avatars/katina.png", activeClients: 2, sessionsThisMonth: 6, revenueThisMonth: 700, utilizationPercent: 55, ytdSessions: 246, ptoHours: 9.84 },
  { id: "5", name: "Lauren Fisher", credential: "LCMHCA", location: "Winston-Salem", email: "lauren@freshbreath.co", avatarUrl: "/therapists/avatars/lauren.png", activeClients: 4, sessionsThisMonth: 9, revenueThisMonth: 1100, utilizationPercent: 71, ytdSessions: 301, ptoHours: 12.04 },
  { id: "6", name: "Linda McAteer", credential: "LCMHC", location: "Raleigh", email: "linda@freshbreath.co", avatarUrl: "/therapists/avatars/linda.png", activeClients: 1, sessionsThisMonth: 5, revenueThisMonth: 400, utilizationPercent: 44, ytdSessions: 198, ptoHours: 7.92 },
  { id: "7", name: "Yeshira Benson", credential: "LCSWA", location: "Winston-Salem", email: "yeshira@freshbreath.co", avatarUrl: "/therapists/avatars/yeshira.png", activeClients: 2, sessionsThisMonth: 7, revenueThisMonth: 800, utilizationPercent: 58, ytdSessions: 254, ptoHours: 10.16 },
  { id: "8", name: "Katrina McGurie", credential: "LCMHC", location: "Wilmington", email: "katrina@freshbreath.co", avatarUrl: "/therapists/avatars/katrina.png", activeClients: 5, sessionsThisMonth: 11, revenueThisMonth: 1300, utilizationPercent: 84, ytdSessions: 368, ptoHours: 14.72 },
  { id: "9", name: "Monica Joyce", credential: "LCMHCA", location: "Greensboro", email: "monica@freshbreath.co", avatarUrl: "/therapists/avatars/monica.png", activeClients: 6, sessionsThisMonth: 12, revenueThisMonth: 1500, utilizationPercent: 92, ytdSessions: 476, ptoHours: 19.04 },
  { id: "10", name: "Tracey Hagan", credential: "LCMHA", location: "Cary", email: "tracey@freshbreath.co", avatarUrl: "/therapists/avatars/tracey.png", activeClients: 1, sessionsThisMonth: 4, revenueThisMonth: 300, utilizationPercent: 36, ytdSessions: 152, ptoHours: 6.08 },
  { id: "11", name: "Raven Armstrong", credential: "LCSW", location: "Raleigh", email: "raven@freshbreath.co", avatarUrl: "/therapists/avatars/raven.png", activeClients: 4, sessionsThisMonth: 9, revenueThisMonth: 1000, utilizationPercent: 68, ytdSessions: 296, ptoHours: 11.84 },
  { id: "12", name: "Jordan Schultz", credential: "LMFTA", location: "Fayetteville", email: "jordan@freshbreath.co", avatarUrl: "/therapists/avatars/jordan.png", activeClients: 3, sessionsThisMonth: 8, revenueThisMonth: 900, utilizationPercent: 66, ytdSessions: 314, ptoHours: 12.56 },
  { id: "13", name: "Ashley Aubas", credential: "LCSWA", location: "Winston-Salem", email: "ashley@freshbreath.co", avatarUrl: "/therapists/avatars/ashley.png", activeClients: 2, sessionsThisMonth: 6, revenueThisMonth: 600, utilizationPercent: 52, ytdSessions: 232, ptoHours: 9.28 },
  { id: "14", name: "Natalie Harris", credential: "LMHCA", location: "Fayetteville", email: "natalie@freshbreath.co", avatarUrl: "/therapists/avatars/natalie.png", activeClients: 1, sessionsThisMonth: 3, revenueThisMonth: 200, utilizationPercent: 28, ytdSessions: 118, ptoHours: 4.72 },
  { id: "15", name: "Catherine (Cay) Fulop", credential: "LCMHC", location: "Wilmington", email: "cay@freshbreath.co", avatarUrl: "/therapists/avatars/cay.png", activeClients: 4, sessionsThisMonth: 10, revenueThisMonth: 1200, utilizationPercent: 76, ytdSessions: 329, ptoHours: 13.16 },
  { id: "16", name: "Kailyn Mattingly", credential: "LCSWA", location: "Wilmington", email: "kailyn@freshbreath.co", avatarUrl: "/therapists/avatars/kailyn.png", activeClients: 5, sessionsThisMonth: 11, revenueThisMonth: 1400, utilizationPercent: 88, ytdSessions: 446, ptoHours: 17.84 },
  { id: "17", name: "Shelby Paske", credential: "LCMHCA", location: "Greensboro", email: "shelby@freshbreath.co", avatarUrl: "/therapists/avatars/shelby.png", activeClients: 1, sessionsThisMonth: 4, revenueThisMonth: 300, utilizationPercent: 32, ytdSessions: 141, ptoHours: 5.64 },
  { id: "18", name: "Lisa McCorrmick", credential: "LCSW, LCAS", location: "Winston-Salem", email: "lisa@freshbreath.co", avatarUrl: "/therapists/avatars/lisa.png", activeClients: 5, sessionsThisMonth: 10, revenueThisMonth: 1200, utilizationPercent: 81, ytdSessions: 391, ptoHours: 15.64 },
];
