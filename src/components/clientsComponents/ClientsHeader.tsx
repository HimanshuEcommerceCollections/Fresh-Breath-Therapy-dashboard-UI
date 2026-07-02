import { clientsData } from "@/src/data/clientsData/clientsData";

export default function ClientsHeader() {
  return (
    <div className="flex flex-row items-end justify-between pb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold leading-9 tracking-[-0.75px] text-[#071123]">
          Clients
        </h1>
        <p className="text-sm font-normal leading-5 tracking-[-0.154px] text-[#596475]">
          {clientsData.length} active clients across the practice
        </p>
      </div>
    </div>
  );
}
