import { LEADS_TABLE_GRID } from "@/src/sections/leadsSections/leadsTableGrid";

const COLUMNS = [
  "Name",
  "Contact",
  "Location",
  "Therapist",
  "Source",
  "Status",
  "Actions",
];

export default function LeadsTableHeaderRow() {
  return (
    <div className={`${LEADS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
      {COLUMNS.map((column) => (
        <div
          key={column}
          className={`px-2 py-2.5 text-sm font-medium tracking-[-0.154px] text-[#596475] ${
            column === "Actions" ? "text-right" : ""
          }`}
        >
          {column}
        </div>
      ))}
    </div>
  );
}
