// Presentation config for the pipeline board columns — not backend data.
//
// Every status gets a column now, including Closed/Inactive. The board used to
// show six of eight and silently hid the rest, so a lead moved to a hidden
// status vanished from the board with no explanation. Colours come from the
// shared palette rather than being restated here.

import {
  contactStatusOptions,
  shortLabel,
  type ContactStatus,
} from "@/src/data/leadsData/contactStatus";
import { contactStatusColors } from "@/src/data/leadsData/contactStatusColors";

export type PipelineStageConfig = {
  status: ContactStatus;
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
};

export const pipelineStages: PipelineStageConfig[] = contactStatusOptions.map(
  (status) => ({
    status,
    // Shortened where the full label would wrap a column header to three lines.
    label: shortLabel(status),
    badgeBg: contactStatusColors[status].bg,
    badgeBorder: contactStatusColors[status].border,
    badgeText: contactStatusColors[status].text,
  }),
);
