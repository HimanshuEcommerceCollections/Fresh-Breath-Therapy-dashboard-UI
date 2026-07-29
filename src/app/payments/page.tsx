"use client";

import PaymentsPageHeader from "@/src/components/paymentsComponents/PaymentsPageHeader";
import PaymentsStatsRow from "@/src/components/paymentsComponents/PaymentsStatsRow";
import PaymentsChartsRow from "@/src/components/paymentsComponents/PaymentsChartsRow";
import PaymentsTable from "@/src/components/paymentsComponents/PaymentsTable";
import { usePayments } from "@/src/hooks/usePayments";
import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function PaymentsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { payments, stats, revenueTrend, statusDistribution, createPayment, isLoading } = usePayments();

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PaymentsPageHeader onCreate={createPayment} />
      <PaymentsStatsRow stats={stats} isLoading={isLoading} />
      <PaymentsChartsRow
        revenueTrend={revenueTrend}
        statusDistribution={statusDistribution}
        isLoading={isLoading}
      />
      <PaymentsTable payments={payments} isLoading={isLoading} />
    </div>
  );
}
