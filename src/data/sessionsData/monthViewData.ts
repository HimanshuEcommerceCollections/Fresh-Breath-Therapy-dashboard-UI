export type MonthDaySession = { time: string; firstName: string };
export type MonthDay = {
  date: number;
  sessions: MonthDaySession[];
  moreCount?: number;
  isToday?: boolean;
};

// June 2026, Sunday-first grid. Leading blank cells (days before June 1) are
// handled in the component's layout logic, not stored here.
// TODO: generalize once real calendar/date state exists.
export const monthViewData: MonthDay[] = [
  // Week 1
  { date: 1, sessions: [] },
  { date: 2, sessions: [] },
  { date: 3, sessions: [] },
  { date: 4, sessions: [] },
  { date: 5, sessions: [] },
  { date: 6, sessions: [] },
  // Week 2
  { date: 7, sessions: [] },
  { date: 8, sessions: [] },
  { date: 9, sessions: [] },
  { date: 10, sessions: [] },
  {
    date: 11,
    sessions: [
      { time: "10:30", firstName: "Wyatt" },
      { time: "14:30", firstName: "Elizabeth" },
      { time: "13:00", firstName: "Olivia" },
    ],
    moreCount: 1,
  },
  {
    date: 12,
    sessions: [
      { time: "13:00", firstName: "Emily" },
      { time: "14:30", firstName: "Lucas" },
      { time: "09:00", firstName: "William" },
    ],
    moreCount: 5,
  },
  {
    date: 13,
    sessions: [
      { time: "09:00", firstName: "Liam" },
      { time: "13:00", firstName: "Ethan" },
      { time: "10:30", firstName: "Mia" },
    ],
    moreCount: 5,
  },
  // Week 3
  { date: 14, sessions: [] },
  { date: 15, sessions: [] },
  {
    date: 16,
    sessions: [
      { time: "14:30", firstName: "Scarlett" },
      { time: "14:30", firstName: "Elizabeth" },
      { time: "16:00", firstName: "Olivia" },
    ],
    moreCount: 2,
  },
  {
    date: 17,
    sessions: [
      { time: "14:30", firstName: "Emily" },
      { time: "09:00", firstName: "Liam" },
      { time: "10:30", firstName: "Mia" },
    ],
    moreCount: 3,
  },
  {
    date: 18,
    sessions: [
      { time: "09:00", firstName: "Lucas" },
      { time: "10:30", firstName: "William" },
      { time: "13:00", firstName: "Elizabeth" },
    ],
    moreCount: 6,
  },
  { date: 19, sessions: [] },
  { date: 20, sessions: [] },
  // Week 4
  {
    date: 21,
    sessions: [
      { time: "16:00", firstName: "Mia" },
      { time: "09:00", firstName: "Jackson" },
      { time: "16:00", firstName: "Elizabeth" },
    ],
    moreCount: 2,
  },
  {
    date: 22,
    sessions: [
      { time: "09:00", firstName: "Emily" },
      { time: "09:00", firstName: "Lucas" },
      { time: "10:30", firstName: "Elizabeth" },
    ],
    moreCount: 6,
  },
  {
    date: 23,
    sessions: [
      { time: "10:30", firstName: "Liam" },
      { time: "13:00", firstName: "William" },
      { time: "13:00", firstName: "Elizabeth" },
    ],
    moreCount: 3,
  },
  { date: 24, sessions: [] },
  { date: 25, sessions: [] },
  {
    date: 26,
    sessions: [
      { time: "09:00", firstName: "Emily" },
      { time: "10:30", firstName: "Lucas" },
      { time: "13:00", firstName: "Liam" },
    ],
    moreCount: 6,
    isToday: true,
  },
  {
    date: 27,
    sessions: [
      { time: "10:30", firstName: "Elizabeth" },
      { time: "14:30", firstName: "Mia" },
      { time: "09:00", firstName: "Isabella" },
    ],
  },
  // Week 5
  {
    date: 28,
    sessions: [
      { time: "14:30", firstName: "Wyatt" },
      { time: "13:00", firstName: "Scarlett" },
      { time: "16:00", firstName: "Amelia" },
    ],
    moreCount: 1,
  },
  { date: 29, sessions: [] },
  { date: 30, sessions: [] },
];
