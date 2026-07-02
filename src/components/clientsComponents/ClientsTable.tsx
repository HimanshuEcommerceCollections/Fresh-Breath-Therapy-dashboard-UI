import { clientsData } from "@/src/data/clientsData/clientsData";
import { CLIENTS_TABLE_GRID } from "@/src/sections/clientsSections/clientsTableGrid";
import ClientTableRow from "@/src/sections/clientsSections/ClientTableRow";

const COLUMNS = [
  "Client",
  "Therapist",
  "Location",
  "Sessions",
  "Lifetime $",
  "Status",
  "", // action column has no header label
];

export default function ClientsTable() {
  return (
    <div className="rounded-[18px] border border-[#E0E5EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className={`${CLIENTS_TABLE_GRID} border-b border-[#E0E5EB] px-4`}>
        {COLUMNS.map((column, index) => (
          <div
            key={column || `col-${index}`}
            className="px-2 py-2.5 text-sm font-medium leading-5 tracking-[-0.154px] text-[#596475]"
          >
            {column}
          </div>
        ))}
      </div>
      <div>
        {clientsData.map((client) => (
          <ClientTableRow key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
