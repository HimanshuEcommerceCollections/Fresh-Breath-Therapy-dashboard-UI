// Single source of truth for the status vocabulary shared by leads and
// clients, mirroring ContactStatus in fbtbackend/app/models/enums.py.
//
// It lives in one file because six places used to keep their own copy — the
// leads table, the pipeline board, the clients pill, the funnel, the reports
// and the CSV export — and a renamed status showed up correctly in some and as
// a raw enum value in the rest.
//
// The UI works in Title-Case labels; services map to/from the API's snake_case
// only at the request/response boundary.

/** The API's raw values, in pipeline order. */
export const CONTACT_STATUS_VALUES = [
  "new_lead",
  "contacted",
  "follow_up",
  "awaiting_client_response",
  "awaiting_therapist_insurance_confirmation",
  "booked",
  "ongoing_therapy",
  "closed_inactive",
] as const;

export type ApiContactStatus = (typeof CONTACT_STATUS_VALUES)[number];

export const STATUS_TO_LABEL = {
  new_lead: "New Lead",
  contacted: "Contacted",
  follow_up: "Follow-Up",
  awaiting_client_response: "Awaiting Client Response",
  awaiting_therapist_insurance_confirmation: "Awaiting Therapist/Insurance Confirmation",
  booked: "Booked",
  ongoing_therapy: "Ongoing Therapy",
  closed_inactive: "Closed/Inactive",
} as const satisfies Record<ApiContactStatus, string>;

/** The Title-Case labels the UI passes around. */
export type ContactStatus = (typeof STATUS_TO_LABEL)[ApiContactStatus];

export const LABEL_TO_STATUS = Object.fromEntries(
  Object.entries(STATUS_TO_LABEL).map(([value, label]) => [label, value]),
) as Record<ContactStatus, ApiContactStatus>;

/** Pipeline order, for dropdowns, the board and the funnel. */
export const contactStatusOptions: ContactStatus[] =
  CONTACT_STATUS_VALUES.map((v) => STATUS_TO_LABEL[v]);

/** Anything but Closed/Inactive, matching the backend's ACTIVE_STATUSES. */
export const INACTIVE_STATUS: ContactStatus = "Closed/Inactive";

// Shorter labels for the funnel and the pipeline column headers, where the
// full "Awaiting Therapist/Insurance Confirmation" wraps to three lines and
// pushes the column out of alignment. Only statuses needing a shorter form
// appear; everything else falls back to its full label.
const SHORT_LABELS: Partial<Record<ContactStatus, string>> = {
  "Awaiting Client Response": "Awaiting Client",
  "Awaiting Therapist/Insurance Confirmation": "Awaiting Confirmation",
};

export const shortLabel = (status: ContactStatus): string =>
  SHORT_LABELS[status] ?? status;
