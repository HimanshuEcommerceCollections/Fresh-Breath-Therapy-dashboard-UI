import type { ContactStatus } from "@/src/data/leadsData/contactStatus";
import { contactStatusColors } from "@/src/data/leadsData/contactStatusColors";

// The status badge on the Lead Search rows (the Add Client flow). Reads from
// the shared palette, so it can no longer show a different colour for the same
// status than the leads table and the pipeline board do.
//
// It used to render its own `label` per status - the old map displayed
// "Consultation Scheduled" as "Consultation Booked" for this screen only. With
// one vocabulary there is nothing left to rename, so the status is its label.
export default function LeadStatusBadge({ status }: { status: ContactStatus }) {
  const colors = contactStatusColors[status];

  return (
    <span
      className="inline-block rounded-full border px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {status}
    </span>
  );
}
