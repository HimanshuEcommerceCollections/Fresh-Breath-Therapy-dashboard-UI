// Single source of truth for the leads table column layout, shared by
// LeadsTableHeaderRow and LeadsTableRow so header/body cells stay aligned.
// Proportions from the design: Name 154 / Contact 231 / Location 121 /
// Therapist 165 / Source 150, with fixed Status (206px) and Actions (92px).
export const LEADS_TABLE_GRID =
  "grid grid-cols-[142fr_222fr_138fr_172fr_147fr_206px_92px] items-center";
