export type SignupRequestRole = "Admin" | "Coordinator" | "Therapist";
export type SignupRequestStatus = "Approved" | "Pending";

export interface SignupRequest {
  id: string;
  name: string;
  email: string;
  role: SignupRequestRole;
  status: SignupRequestStatus;
}

// Role dropdown options — ordered per the reference screenshot.
export const roleOptions: SignupRequestRole[] = [
  "Admin",
  "Coordinator",
  "Therapist",
];

// Role pill visual config: background, border, text.
export const roleStyleConfig: Record<
  SignupRequestRole,
  { bg: string; border: string; text: string }
> = {
  Admin: { bg: "#EFF6FF", border: "#DBEAFE", text: "#1D4ED8" },
  Coordinator: { bg: "#FFF7ED", border: "#FFEDD5", text: "#C2410C" },
  Therapist: { bg: "#ECFDF5", border: "#D1FAE5", text: "#047857" },
};

// Status badge visual config: background, dot color, text.
export const statusStyleConfig: Record<
  SignupRequestStatus,
  { bg: string; dot: string; text: string }
> = {
  Approved: { bg: "#ECFDF5", dot: "#10B981", text: "#047857" },
  Pending: { bg: "#FFF7ED", dot: "#F97316", text: "#C2410C" },
};

// Avatar palette — same 6-colour cycle used in TherapistFilterDropdown.
export const AVATAR_PALETTE: { bg: string; text: string }[] = [
  { bg: "#DBEAFE", text: "#1447E6" },
  { bg: "#D0FAE5", text: "#007A55" },
  { bg: "#FEF3C6", text: "#BB4D00" },
  { bg: "#FFE4E6", text: "#C70036" },
  { bg: "#EDE9FE", text: "#7008E7" },
  { bg: "#CBFBF1", text: "#00786F" },
];

// TODO: replace with backend-fetched data (GET /signup-requests).
// 6 rows per spec; "Rejected" rows are deleted users — they don't appear here.
export const signupRequestsMock: SignupRequest[] = [
  {
    id: "1",
    name: "Elizabeth Garcia",
    email: "elizabeth.garcia@email.com",
    role: "Therapist",
    status: "Approved",
  },
  {
    id: "2",
    name: "Marcus Bennett",
    email: "marcus.bennett@email.com",
    role: "Coordinator",
    status: "Approved",
  },
  {
    id: "3",
    name: "Priya Shah",
    email: "priya.shah@email.com",
    role: "Admin",
    status: "Pending",
  },
  {
    id: "4",
    name: "Wyatt Owens",
    email: "wyatt.owens@email.com",
    role: "Therapist",
    status: "Approved",
  },
  {
    id: "5",
    name: "Caden Morris",
    email: "caden.morris@email.com",
    role: "Therapist",
    status: "Approved",
  },
  {
    id: "6",
    name: "Sophia Delgado",
    email: "sophia.delgado@email.com",
    role: "Coordinator",
    status: "Pending",
  },
];
