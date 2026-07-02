import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";

export type DaySession = {
  time: string;
  client: string;
  type: string;
  therapist: string;
  status: SessionStatus;
};

// Static for now, matches the month nav date. TODO: real date state later.
export const dayViewDate = "Mon Jun 29 2026";

export const dayViewData: DaySession[] = [
  { time: "09:00", client: "Emily Garcia", type: "Group Therapy", therapist: "Lisa McCorrmick", status: "Cancelled" },
  { time: "10:30", client: "Lucas Taylor", type: "Group Therapy", therapist: "Ashley Aubas", status: "Completed" },
  { time: "10:30", client: "William Foster", type: "Consultation", therapist: "Lauren Fisher", status: "Completed" },
  { time: "10:30", client: "Isabella Smith", type: "Consultation", therapist: "Katrina McGurie", status: "Scheduled" },
  { time: "10:30", client: "Sophia Parker", type: "Group Therapy", therapist: "Jaimy Summerlin", status: "Rescheduled" },
  { time: "13:00", client: "Liam Quinn", type: "Family Therapy", therapist: "Yeshira Benson", status: "Completed" },
  { time: "16:00", client: "Elizabeth Owens", type: "Group Therapy", therapist: "Jordan Schultz", status: "Completed" },
  { time: "16:00", client: "Olivia Young", type: "Individual Therapy", therapist: "Katrina McGurie", status: "Scheduled" },
  { time: "16:00", client: "Isabella Walker", type: "Group Therapy", therapist: "Kaylee Meyers", status: "Completed" },
];
