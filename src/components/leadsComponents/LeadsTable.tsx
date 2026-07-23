import type { Lead } from "@/src/services/leadsService";
import LeadsTableHeaderRow from "@/src/sections/leadsSections/LeadsTableHeaderRow";
import LeadsTableRow from "@/src/sections/leadsSections/LeadsTableRow";

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <LeadsTableHeaderRow />
      <div>
        {leads.map((lead) => (
          <LeadsTableRow key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
