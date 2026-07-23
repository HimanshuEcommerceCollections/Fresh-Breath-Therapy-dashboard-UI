// MISMATCH: this used to be its own 4-value type ("Missed", no
// "Rescheduled") that didn't match section 11's real 5-value session status
// enum — now reuses the canonical SessionStatus from sessionsData.ts.
export type { SessionStatus } from "@/src/data/sessionsData/sessionsData";
import type { SessionStatus } from "@/src/data/sessionsData/sessionsData";

export type UpcomingSession = {
  id: string;
  month: string; // "JUN"
  day: string; // "25"
  clientName: string;
  time: string; // "16:00"
  therapistName: string;
  status: SessionStatus;
};

// TODO: replace with backend-fetched upcoming sessions.
export const upcomingSessionsData: UpcomingSession[] = [
  {
    id: "1",
    month: "JUN",
    day: "25",
    clientName: "Olivia Young",
    time: "16:00",
    therapistName: "Katrina McGurie",
    status: "Scheduled",
  },
  {
    id: "2",
    month: "JUN",
    day: "25",
    clientName: "Isabella Smith",
    time: "10:30",
    therapistName: "Katrina McGurie",
    status: "Scheduled",
  },
  {
    id: "3",
    month: "JUN",
    day: "26",
    clientName: "Elizabeth Garcia",
    time: "10:30",
    therapistName: "Catherine (Cay) Fulop",
    status: "Scheduled",
  },
  {
    id: "4",
    month: "JUN",
    day: "26",
    clientName: "Mia Brown",
    time: "14:30",
    therapistName: "Katina Redmond",
    status: "Scheduled",
  },
  {
    id: "5",
    month: "JUN",
    day: "26",
    clientName: "Isabella Vasquez",
    time: "09:00",
    therapistName: "Naja Cotton",
    status: "Scheduled",
  },
];
