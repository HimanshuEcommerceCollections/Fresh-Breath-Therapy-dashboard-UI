// TODO: replace with backend-fetched packages (/api/settings/packages).
export type ServicePackage = { name: string; price: number; label: string };

export const packagesData: ServicePackage[] = [
  { name: "4 Sessions Starter", price: 480, label: "4 Sessions Starter — $480" },
  { name: "8 Sessions Plus", price: 880, label: "8 Sessions Plus — $880" },
  { name: "12 Sessions Pro", price: 1260, label: "12 Sessions Pro — $1,260" },
  { name: "Single Session", price: 130, label: "Single Session — $130" },
];
