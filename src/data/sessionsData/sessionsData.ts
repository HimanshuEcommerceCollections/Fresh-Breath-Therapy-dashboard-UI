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
