// Single source of truth for the payments table column layout, shared by the
// header row and body rows. One row = one INVOICE (a client's package
// purchase cycle): Client / Package / Due / Paid / Balance / Started / Status.
export const PAYMENTS_TABLE_GRID =
  "grid grid-cols-[150fr_200fr_100fr_100fr_110fr_110fr_184px] items-center";
