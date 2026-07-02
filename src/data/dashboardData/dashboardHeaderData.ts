import { currentUser } from "@/src/data/layoutData/userData";

export type DashboardHeaderContent = {
  greetingName: string;
  subtitle: string;
};

// TODO: subtitle copy (clinic count) will come from backend/session data later.
export const dashboardHeaderContent: DashboardHeaderContent = {
  greetingName: currentUser.name,
  subtitle:
    "Here's what's happening across all 6 Fresh Breath Therapy clinics today.",
};
