export type PTOStat = {
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  iconSrc: string;
};

// TODO: replace with backend-fetched PTO stats. Icons live at
// public/ptodashboard/ (their actual location — not duplicated into
// dashboard/dashboardicons/).
export const ptoStatsData: PTOStat[] = [
  { label: "Total Therapists", value: "18", iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)", iconSrc: "/ptodashboard/totaltherapist.svg" },
  { label: "Total Sessions", value: "3,342", iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)", iconSrc: "/ptodashboard/totalsessions.svg" },
  { label: "PTO Accrued", value: "133.68h", iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)", iconSrc: "/ptodashboard/ptoaccrued.svg" },
  { label: "PTO Used", value: "0h", iconColor: "#F2A618", iconBg: "rgba(242,166,24,0.1)", iconSrc: "/ptodashboard/ptoused.svg" },
  { label: "PTO Balance", value: "133.68h", iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)", iconSrc: "/ptodashboard/ptobalance.svg" },
];
