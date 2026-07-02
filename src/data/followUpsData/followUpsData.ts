export type FollowUpStatus = "Pending" | "Overdue" | "Completed";

export type FollowUp = {
  id: string;
  client: string;
  dueDate: string; // "2026-06-21"
  notes: string;
  reminder: boolean; // renders as "On" / "Off"
  status: FollowUpStatus;
};

// TODO: replace with backend-fetched follow-ups (/api/follow-ups).
// Due dates use the "All" tab's reference screenshot as canonical — the
// per-tab screenshots show different dates for the same clients (separately
// regenerated mock data); not worth reconciling in placeholder data.
export const followUpsData: FollowUp[] = [
  { id: "1", client: "Emily Garcia", dueDate: "2026-06-21", notes: "Call to confirm next session", reminder: true, status: "Completed" },
  { id: "2", client: "Caden Harris", dueDate: "2026-06-22", notes: "Check on therapy progress", reminder: false, status: "Overdue" },
  { id: "3", client: "Lucas Taylor", dueDate: "2026-06-23", notes: "Discuss package renewal", reminder: true, status: "Overdue" },
  { id: "4", client: "Liam Quinn", dueDate: "2026-06-24", notes: "Insurance follow-up", reminder: false, status: "Completed" },
  { id: "5", client: "William Foster", dueDate: "2026-06-25", notes: "Call to confirm next session", reminder: true, status: "Pending" },
  { id: "6", client: "Owen Walker", dueDate: "2026-06-26", notes: "Check on therapy progress", reminder: false, status: "Pending" },
  { id: "7", client: "Elizabeth Garcia", dueDate: "2026-06-27", notes: "Discuss package renewal", reminder: true, status: "Pending" },
  { id: "8", client: "Liam Garcia", dueDate: "2026-06-28", notes: "Insurance follow-up", reminder: false, status: "Pending" },
  { id: "9", client: "Ethan Quinn", dueDate: "2026-06-29", notes: "Call to confirm next session", reminder: true, status: "Pending" },
  { id: "10", client: "Mia Foster", dueDate: "2026-06-30", notes: "Check on therapy progress", reminder: false, status: "Pending" },
  { id: "11", client: "Wyatt Owens", dueDate: "2026-06-21", notes: "Discuss package renewal", reminder: true, status: "Overdue" },
  { id: "12", client: "Scarlett Carter", dueDate: "2026-06-22", notes: "Insurance follow-up", reminder: false, status: "Overdue" },
  { id: "13", client: "Evelyn Parker", dueDate: "2026-06-23", notes: "Call to confirm next session", reminder: true, status: "Completed" },
  { id: "14", client: "Elizabeth Owens", dueDate: "2026-06-24", notes: "Check on therapy progress", reminder: false, status: "Overdue" },
  { id: "15", client: "Mia Brown", dueDate: "2026-06-25", notes: "Discuss package renewal", reminder: true, status: "Pending" },
  { id: "16", client: "Wyatt Foster", dueDate: "2026-06-26", notes: "Insurance follow-up", reminder: false, status: "Pending" },
  { id: "17", client: "Olivia Smith", dueDate: "2026-06-27", notes: "Call to confirm next session", reminder: true, status: "Pending" },
  { id: "18", client: "Olivia Young", dueDate: "2026-06-28", notes: "Check on therapy progress", reminder: false, status: "Pending" },
  { id: "19", client: "Noah Johnson", dueDate: "2026-06-29", notes: "Discuss package renewal", reminder: true, status: "Pending" },
  { id: "20", client: "Isabella Smith", dueDate: "2026-06-30", notes: "Insurance follow-up", reminder: false, status: "Pending" },
  { id: "21", client: "Henry Smith", dueDate: "2026-06-21", notes: "Call to confirm next session", reminder: true, status: "Overdue" },
  { id: "22", client: "James Harris", dueDate: "2026-06-22", notes: "Check on therapy progress", reminder: false, status: "Completed" },
  { id: "23", client: "Charlotte Garcia", dueDate: "2026-06-23", notes: "Discuss package renewal", reminder: true, status: "Overdue" },
  { id: "24", client: "Mason Brown", dueDate: "2026-06-24", notes: "Insurance follow-up", reminder: false, status: "Overdue" },
];
