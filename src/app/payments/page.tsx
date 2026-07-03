import PaymentsPageHeader from "@/src/components/paymentsComponents/PaymentsPageHeader";
import PaymentsStatsRow from "@/src/components/paymentsComponents/PaymentsStatsRow";
import PaymentsChartsRow from "@/src/components/paymentsComponents/PaymentsChartsRow";
import PaymentsTable from "@/src/components/paymentsComponents/PaymentsTable";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PaymentsPageHeader />
      <PaymentsStatsRow />
      <PaymentsChartsRow />
      <PaymentsTable />
    </div>
  );
}
