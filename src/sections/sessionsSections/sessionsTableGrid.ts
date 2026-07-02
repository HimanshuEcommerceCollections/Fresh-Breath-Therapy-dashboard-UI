// Single source of truth for the sessions list table column layout, shared by
// the header row and body rows. Fixed widths from the design export
// (Date 150 / Time 80 / Client 190 / Therapist 241 / Type 210), with Status
// taking the remaining width.
export const SESSIONS_TABLE_GRID =
  "grid grid-cols-[150px_80px_190px_241px_210px_minmax(0,1fr)] items-center";
