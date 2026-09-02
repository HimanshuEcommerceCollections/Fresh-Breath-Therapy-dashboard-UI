"use client";

import { useState } from "react";
import PaymentsPageHeader from "@/src/components/paymentsComponents/PaymentsPageHeader";
import PaymentsStatsRow from "@/src/components/paymentsComponents/PaymentsStatsRow";
import PaymentsChartsRow from "@/src/components/paymentsComponents/PaymentsChartsRow";
import PaymentsTable from "@/src/components/paymentsComponents/PaymentsTable";
import PaymentFilterTabs from "@/src/sections/paymentsSections/PaymentFilterTabs";
import EditPaymentModal from "@/src/sections/paymentsSections/EditPaymentModal";
import SearchInput from "@/src/sections/leadsSections/SearchInput";
import type { Payment } from "@/src/services/paymentsService";
import {
  paymentMethodOptions,
  paymentStatusOptions,
  paymentStatusColors,
  LABEL_TO_STATUS,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";
import { usePayments } from "@/src/hooks/usePayments";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { canWrite } from "@/src/lib/permissions";

const STATUS_DOTS = Object.fromEntries(
  paymentStatusOptions.map((label) => [label, paymentStatusColors[LABEL_TO_STATUS[label]].dot]),
) as Record<PaymentStatus, string>;

export default function PaymentsPage() {
  const { isChecking } = useRequireRole(["Admin", "Coordinator"], "/leads");
  const { role } = useCurrentUser();
  const [editing, setEditing] = useState<Payment | null>(null);
  const {
    payments,
    stats,
    revenueTrend,
    statusDistribution,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    updatePayment,
    isLoading,
  } = usePayments();

  if (isChecking) return null;

  const isFiltered = Boolean(search || statusFilter || methodFilter);

  return (
    <div className="flex flex-col gap-4 px-8 pb-12 pt-24">
      <PaymentsPageHeader statusFilter={statusFilter} methodFilter={methodFilter} />
      <PaymentsStatsRow stats={stats} isLoading={isLoading} />
      <PaymentsChartsRow
        revenueTrend={revenueTrend}
        statusDistribution={statusDistribution}
        isLoading={isLoading}
      />

      {/* Search first, then the two filter rows: the common task is "find this
          patient and mark their session paid", which starts with the name. */}
      <div className="flex flex-col gap-3 rounded-[18px] border border-[#E0E5EB] bg-white p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search payments by patient name…"
        />
        <PaymentFilterTabs
          label="Status"
          options={paymentStatusOptions}
          active={statusFilter}
          onChange={setStatusFilter}
          dotClass={STATUS_DOTS}
        />
        <PaymentFilterTabs
          label="Method"
          options={paymentMethodOptions}
          active={methodFilter}
          onChange={setMethodFilter}
        />
      </div>

      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        canEdit={canWrite(role)}
        isFiltered={isFiltered}
        onStatusChange={(id, status) => void updatePayment(id, { status })}
        onEdit={setEditing}
      />

      {editing && (
        <EditPaymentModal
          payment={editing}
          onClose={() => setEditing(null)}
          onSave={updatePayment}
        />
      )}
    </div>
  );
}
