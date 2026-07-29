export type SignupRequestStatus = "pending" | "approved";

export interface SignupRequestRole {
  id: string;
  name: string;
}

export interface SignupRequest {
  id: string;
  status: SignupRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  // null until the request is approved — it records the role actually
  // assigned at approval time, not something the user requested at signup.
  requestedRole: SignupRequestRole | null;
}

// Role pill visual config, keyed by role name. Admin/Coordinator/Therapist
// are the only roles the backend currently defines (per GET
// /api/settings/roles), but any unrecognized name falls back to a neutral
// style rather than crashing if a 4th role is ever added.
export const roleStyleConfig: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Admin: { bg: "#EFF6FF", border: "#DBEAFE", text: "#1D4ED8" },
  Coordinator: { bg: "#FFF7ED", border: "#FFEDD5", text: "#C2410C" },
  Therapist: { bg: "#ECFDF5", border: "#D1FAE5", text: "#047857" },
};

export const defaultRoleStyle = { bg: "#F1F5F9", border: "#E2E8F0", text: "#475569" };

// Status badge visual config: background, dot color, text.
export const statusStyleConfig: Record<
  SignupRequestStatus,
  { bg: string; dot: string; text: string; label: string }
> = {
  approved: { bg: "#ECFDF5", dot: "#10B981", text: "#047857", label: "Approved" },
  pending: { bg: "#FFF7ED", dot: "#F97316", text: "#C2410C", label: "Pending" },
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
