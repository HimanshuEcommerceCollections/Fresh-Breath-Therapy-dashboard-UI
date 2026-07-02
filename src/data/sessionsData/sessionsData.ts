export type SessionStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "No Show"
  | "Rescheduled";

export type SessionRow = {
  id: string;
  date: string; // "2026-07-21"
  time: string; // "16:00"
  client: string;
  therapist: string;
  type: string; // "Group Therapy" | "Consultation" | "Individual Therapy" | "Couples Therapy" | "Family Therapy"
  status: SessionStatus;
};

// TODO: replace with backend-fetched sessions (/api/sessions).
// Rows 1–5 are exact from the spec. The remaining rows are PLACEHOLDERS —
// the full ~110-row dataset should be transcribed from the List view
// reference screenshot (Sessions__1_.png) once it's attached in a session.
export const sessionsData: SessionRow[] = [
  { id: "1", date: "2026-07-21", time: "16:00", client: "Isabella Vasquez", therapist: "Naja Cotton", type: "Group Therapy", status: "Scheduled" },
  { id: "2", date: "2026-07-19", time: "10:30", client: "Scarlett Carter", therapist: "Lisa McCorrmick", type: "Consultation", status: "Scheduled" },
  { id: "3", date: "2026-07-19", time: "10:30", client: "Isabella Smith", therapist: "Jaimy Summerlin", type: "Couples Therapy", status: "Scheduled" },
  { id: "4", date: "2026-07-16", time: "16:00", client: "Sophia Parker", therapist: "Jaimy Summerlin", type: "Individual Therapy", status: "Scheduled" },
  { id: "5", date: "2026-07-15", time: "09:00", client: "Olivia Young", therapist: "Katrina McGurie", type: "Consultation", status: "Scheduled" },
  { id: "6", date: "2026-07-14", time: "14:30", client: "Mia Brown", therapist: "Katina Redmond", type: "Individual Therapy", status: "Scheduled" },
  { id: "7", date: "2026-07-14", time: "11:00", client: "Elizabeth Garcia", therapist: "Catherine (Cay) Fulop", type: "Family Therapy", status: "Scheduled" },
  { id: "8", date: "2026-07-13", time: "15:30", client: "Lucas Taylor", therapist: "Ashley Aubas", type: "Individual Therapy", status: "Scheduled" },
  { id: "9", date: "2026-07-12", time: "10:00", client: "Elizabeth Harris", therapist: "Ashley Aubas", type: "Group Therapy", status: "Scheduled" },
  { id: "10", date: "2026-07-10", time: "13:00", client: "Elizabeth Owens", therapist: "Jordan Schultz", type: "Individual Therapy", status: "Scheduled" },
  { id: "11", date: "2026-07-09", time: "09:30", client: "Ethan Quinn", therapist: "Tracey Hagan", type: "Consultation", status: "Scheduled" },
  { id: "12", date: "2026-07-08", time: "16:30", client: "Emily Garcia", therapist: "Lisa McCorrmick", type: "Consultation", status: "Scheduled" },
  { id: "13", date: "2026-07-07", time: "11:30", client: "Isabella Walker", therapist: "Kaylee Meyers", type: "Individual Therapy", status: "Scheduled" },
  { id: "14", date: "2026-07-06", time: "14:00", client: "Amelia Carter", therapist: "Katina Redmond", type: "Consultation", status: "Scheduled" },
  { id: "15", date: "2026-07-03", time: "10:30", client: "Liam Quinn", therapist: "Yeshira Benson", type: "Individual Therapy", status: "Scheduled" },
  { id: "16", date: "2026-07-02", time: "15:00", client: "William Foster", therapist: "Lauren Fisher", type: "Group Therapy", status: "Scheduled" },
  { id: "17", date: "2026-07-01", time: "09:00", client: "Jackson Owens", therapist: "Lauren Fisher", type: "Consultation", status: "Scheduled" },
  { id: "18", date: "2026-06-30", time: "16:00", client: "Mia Foster", therapist: "Catherine (Cay) Fulop", type: "Individual Therapy", status: "Completed" },
  { id: "19", date: "2026-06-28", time: "11:00", client: "Wyatt Owens", therapist: "Naja Cotton", type: "Family Therapy", status: "Completed" },
  { id: "20", date: "2026-06-26", time: "13:30", client: "Isabella Smith", therapist: "Katrina McGurie", type: "Individual Therapy", status: "Completed" },
  { id: "21", date: "2026-06-25", time: "10:30", client: "Olivia Young", therapist: "Katrina McGurie", type: "Consultation", status: "No Show" },
  { id: "22", date: "2026-06-24", time: "15:30", client: "Scarlett Carter", therapist: "Lisa McCorrmick", type: "Group Therapy", status: "Completed" },
  { id: "23", date: "2026-06-23", time: "09:30", client: "Sophia Parker", therapist: "Jaimy Summerlin", type: "Individual Therapy", status: "Rescheduled" },
  { id: "24", date: "2026-06-22", time: "14:00", client: "Elizabeth Owens", therapist: "Jordan Schultz", type: "Individual Therapy", status: "Completed" },
  { id: "25", date: "2026-06-20", time: "10:00", client: "Lucas Taylor", therapist: "Ashley Aubas", type: "Consultation", status: "Cancelled" },
  { id: "26", date: "2026-06-19", time: "16:30", client: "Ethan Quinn", therapist: "Tracey Hagan", type: "Individual Therapy", status: "Completed" },
  { id: "27", date: "2026-06-18", time: "11:30", client: "Emily Garcia", therapist: "Lisa McCorrmick", type: "Consultation", status: "Completed" },
  { id: "28", date: "2026-06-17", time: "13:00", client: "Mia Brown", therapist: "Katina Redmond", type: "Couples Therapy", status: "Cancelled" },
  { id: "29", date: "2026-06-16", time: "15:00", client: "Isabella Vasquez", therapist: "Naja Cotton", type: "Consultation", status: "Completed" },
  { id: "30", date: "2026-06-15", time: "09:00", client: "Elizabeth Garcia", therapist: "Catherine (Cay) Fulop", type: "Individual Therapy", status: "Completed" },
];
