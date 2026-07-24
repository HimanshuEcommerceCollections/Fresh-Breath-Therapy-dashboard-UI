// MISMATCH: section 9's real follow-up status enum is
// pending|overdue|completed — renamed from the old mock's "Upcoming" to
// "Pending" to match reality (nothing else depends on the old wording).
export type FollowUpStatus = "Overdue" | "Pending" | "Completed";

export type FollowUpItem = {
  id: string;
  clientName: string;
  date: string; // "2026-06-21"
  note: string; // "Discuss package renewal"
  status: FollowUpStatus;
};

// TODO: replace with backend-fetched follow-up queue.
export const followUpQueueData: FollowUpItem[] = [
  {
    id: "1",
    clientName: "Wyatt Owens",
    date: "2026-06-21",
    note: "Discuss package renewal",
    status: "Overdue",
  },
  {
    id: "2",
    clientName: "Henry Smith",
    date: "2026-06-21",
    note: "Call to confirm next session",
    status: "Overdue",
  },
  {
    id: "3",
    clientName: "Caden Harris",
    date: "2026-06-22",
    note: "Check on therapy progress",
    status: "Overdue",
  },
  {
    id: "4",
    clientName: "Scarlett Carter",
    date: "2026-06-22",
    note: "Insurance follow-up",
    status: "Overdue",
  },
  {
    id: "5",
    clientName: "Lucas Taylor",
    date: "2026-06-23",
    note: "Discuss package renewal",
    status: "Overdue",
  },
];
