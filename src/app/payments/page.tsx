"use client";

import PaymentsPageHeader from "@/src/components/paymentsComponents/PaymentsPageHeader";
import PaymentsStatsRow from "@/src/components/paymentsComponents/PaymentsStatsRow";
import PaymentsChartsRow from "@/src/components/paymentsComponents/PaymentsChartsRow";
import PaymentsTable from "@/src/components/paymentsComponents/PaymentsTable";
import { usePayments } from "@/src/hooks/usePayments";

export default function PaymentsPage() {
  const { payments, stats, revenueTrend, statusDistribution, createPayment } = usePayments();

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PaymentsPageHeader onCreate={createPayment} />
      <PaymentsStatsRow stats={stats} />
      <PaymentsChartsRow revenueTrend={revenueTrend} statusDistribution={statusDistribution} />
      <PaymentsTable payments={payments} />
    </div>
  );
}
