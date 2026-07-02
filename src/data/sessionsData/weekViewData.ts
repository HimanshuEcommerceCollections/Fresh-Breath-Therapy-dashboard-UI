export type WeekDaySession = { time: string; client: string };
export type WeekDay = { label: string; date: number; sessions: WeekDaySession[] };

// TODO: replace with backend-fetched week data once real date state exists.
export const weekViewData: WeekDay[] = [
  { label: "SUN", date: 28, sessions: [] },
  {
    label: "MON",
    date: 29,
    sessions: [
      { time: "09:00", client: "Emily Garcia" },
      { time: "10:30", client: "Lucas Taylor" },
      { time: "10:30", client: "William Foster" },
      { time: "10:30", client: "Isabella Smith" },
      { time: "10:30", client: "Sophia Parker" },
      { time: "13:00", client: "Liam Quinn" },
      { time: "16:00", client: "Elizabeth Owens" },
      { time: "16:00", client: "Olivia Young" },
      { time: "16:00", client: "Isabella Walker" },
    ],
  },
  {
    label: "TUE",
    date: 30,
    sessions: [
      { time: "09:00", client: "Isabella Vasquez" },
      { time: "10:30", client: "Elizabeth Garcia" },
      { time: "14:30", client: "Mia Brown" },
    ],
  },
  {
    label: "WED",
    date: 1,
    sessions: [
      { time: "13:00", client: "Scarlett Carter" },
      { time: "14:30", client: "Wyatt Owens" },
      { time: "14:30", client: "Isabella Smith" },
      { time: "16:00", client: "Amelia Carter" },
    ],
  },
  { label: "THU", date: 2, sessions: [] },
  { label: "FRI", date: 3, sessions: [] },
  {
    label: "SAT",
    date: 4,
    sessions: [
      { time: "13:00", client: "Wyatt Owens" },
      { time: "14:30", client: "Isabella Vasquez" },
      { time: "16:00", client: "Scarlett Carter" },
      { time: "16:00", client: "Mia Brown" },
    ],
  },
];
