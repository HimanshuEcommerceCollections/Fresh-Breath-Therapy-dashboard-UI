// src/hooks/usePayments.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentsService,
  type Payment,
  type PaymentFilters,
  type UpdatePaymentPayload,
} from "@/src/services/paymentsService";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { showSuccessToast } from "@/src/lib/toast";
import {
  LABEL_TO_STATUS,
  isCollected,
  isOutstanding,
  paymentStatusColors,
  STATUS_TO_LABEL,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";
import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import type { RevenueBarPoint } from "@/src/data/paymentsData/revenueTrendBarData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

const SEARCH_DEBOUNCE_MS = 350;

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;

const sumWhere = (payments: Payment[], keep: (p: Payment) => boolean) =>
  payments.reduce((total, p) => (keep(p) ? total + p.amount : total), 0);

// Collected / Outstanding / Cancelled, computed exactly as the backend does
// (see COLLECTED_STATUSES and OUTSTANDING_STATUSES in enums.py). Cancelled is
// shown as its own card rather than hidden: money deliberately written off is
// worth seeing, and its absence from the other two is then obvious instead of
// looking like the numbers fail to add up.
function computeStats(payments: Payment[]): PaymentStat[] {
  const collected = sumWhere(payments, (p) => isCollected(LABEL_TO_STATUS[p.status]));
  const outstanding = sumWhere(payments, (p) => isOutstanding(LABEL_TO_STATUS[p.status]));
  const cancelled = sumWhere(payments, (p) => p.status === "Cancelled");

  const now = new Date();
  const thisMonth = sumWhere(payments, (p) => {
    const d = new Date(p.date);
    return (
      isCollected(LABEL_TO_STATUS[p.status]) &&
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  });

  return [
    { label: "Collected", value: formatCurrency(collected), iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" },
    { label: "This Month", value: formatCurrency(thisMonth), iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)" },
    { label: "Outstanding", value: formatCurrency(outstanding), iconColor: "#F2A618", iconBg: "rgba(242,166,24,0.1)" },
    { label: "Cancelled", value: formatCurrency(cancelled), iconColor: "#64748B", iconBg: "rgba(100,116,139,0.1)" },
  ];
}

function computeRevenueTrend(payments: Payment[]): RevenueBarPoint[] {
  const now = new Date();
  const months: { key: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }

  return months.map(({ key, label }) => ({
    month: label,
    revenue: sumWhere(payments, (p) => {
      const d = new Date(p.date);
      return (
        isCollected(LABEL_TO_STATUS[p.status]) &&
        `${d.getFullYear()}-${d.getMonth()}` === key
      );
    }),
  }));
}

// By AMOUNT, not by count. The donut used to slice invoice counts, which made
// one $30 copay look the same size as one $400 self-pay session.
function computeStatusDistribution(payments: Payment[]): PaymentStatusSlice[] {
  return (Object.keys(STATUS_TO_LABEL) as (keyof typeof STATUS_TO_LABEL)[])
    .map((value) => ({
      status: STATUS_TO_LABEL[value],
      value: sumWhere(payments, (p) => LABEL_TO_STATUS[p.status] === value),
      color: paymentStatusColors[value].text,
    }))
    .filter((slice) => slice.value > 0);
}

export const usePayments = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | null>(null);
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | null>(null);

  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

  const filters: PaymentFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter ?? undefined,
      method: methodFilter ?? undefined,
    }),
    [debouncedSearch, statusFilter, methodFilter],
  );

  // The filtered list the table shows.
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", "all", filters],
    queryFn: () => paymentsService.fetchAllPayments(filters),
  });

  // The stat cards and charts describe the whole practice, not the current
  // filter — otherwise clicking "Pending" would make Collected read $0.
  const { data: allPayments = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["payments", "all", {}],
    queryFn: () => paymentsService.fetchAllPayments(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    // Lifetime value on the Clients page is derived from these same rows.
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePaymentPayload }) =>
      paymentsService.updatePayment(id, payload),
    onSuccess: (updated) => {
      showSuccessToast(`Payment updated — ${updated.status}`);
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentsService.deletePayment(id),
    onSuccess: () => {
      showSuccessToast("Payment deleted");
      invalidate();
    },
  });

  return {
    payments,
    isLoading: isLoading || isLoadingAll,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
    stats: computeStats(allPayments),
    revenueTrend: computeRevenueTrend(allPayments),
    statusDistribution: computeStatusDistribution(allPayments),
    updatePayment: (id: string, payload: UpdatePaymentPayload) =>
      updateMutation.mutateAsync({ id, payload }),
    deletePayment: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
