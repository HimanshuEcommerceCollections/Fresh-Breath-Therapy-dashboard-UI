"use client";

import PaymentsPageHeader from "@/src/components/paymentsComponents/PaymentsPageHeader";
import PaymentsStatsRow from "@/src/components/paymentsComponents/PaymentsStatsRow";
import PaymentsChartsRow from "@/src/components/paymentsComponents/PaymentsChartsRow";
import PaymentsTable from "@/src/components/paymentsComponents/PaymentsTable";
import PaymentStatusFilterTabs from "@/src/sections/paymentsSections/PaymentStatusFilterTabs";
import { usePayments } from "@/src/hooks/usePayments";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { canWrite } from "@/src/lib/permissions";

export default function PaymentsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { role } = useCurrentUser();
  const {
    invoices,
    stats,
    revenueTrend,
    statusDistribution,
    createPayment,
    createInvoice,
    setPaymentStatus,
    statusFilter,
    setStatusFilter,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePayments();

  if (isChecking) return null;

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PaymentsPageHeader
        onCreate={createPayment}
        onCreateInvoice={createInvoice}
        statusFilter={statusFilter}
      />
      <PaymentsStatsRow stats={stats} isLoading={isLoading} />
      <PaymentsChartsRow
        revenueTrend={revenueTrend}
        statusDistribution={statusDistribution}
        isLoading={isLoading}
      />
      <PaymentStatusFilterTabs active={statusFilter} onChange={setStatusFilter} />
      <PaymentsTable
        invoices={invoices}
        isLoading={isLoading}
        canEdit={canWrite(role)}
        onStatusChange={(id, status) => void setPaymentStatus(id, status)}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
