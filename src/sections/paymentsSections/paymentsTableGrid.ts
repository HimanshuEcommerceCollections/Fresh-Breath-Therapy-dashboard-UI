// Single source of truth for the payments table column layout, shared by the
// header row and body rows.
//
// One row = one PAYMENT. It used to be one INVOICE, with a
// Client / Package / Due / Paid / Balance / Started / Status shape. With
// packages gone there is no due-versus-paid split to show, only what a
// session cost and whether it has been settled.
export const PAYMENTS_TABLE_GRID =
  "grid grid-cols-[220fr_130fr_140fr_150fr_170px_92px] items-center";
