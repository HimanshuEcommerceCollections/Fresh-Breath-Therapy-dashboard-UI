import ClientsHeader from "@/src/components/clientsComponents/ClientsHeader";
import ClientsToolbar from "@/src/components/clientsComponents/ClientsToolbar";
import ClientsTable from "@/src/components/clientsComponents/ClientsTable";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <ClientsHeader />
      <ClientsToolbar />
      <ClientsTable />
    </div>
  );
}
