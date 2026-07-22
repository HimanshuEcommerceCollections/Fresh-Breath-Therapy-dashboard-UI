// Canonical package options for the Record Payment modal and anywhere else
// packages appear (e.g. a future client profile page).
// Keep this as the single source of truth — don't duplicate inline.
export type PackageOption = { label: string; price: number };

export const packageOptions: PackageOption[] = [
  { label: "4 Sessions Starter — $480", price: 480 },
  { label: "8 Sessions Plus — $880", price: 880 },
  { label: "12 Sessions Pro — $1,260", price: 1260 },
  { label: "Single Session — $130", price: 130 },
];
