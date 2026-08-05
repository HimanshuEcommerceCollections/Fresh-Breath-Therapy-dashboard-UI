// src/hooks/usePayments.ts
"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentsService,
  type Payment,
  type CreatePaymentPayload,
  type CreatePaymentResult,
} from "@/src/services/paymentsService";
import { enrollmentsService, type EnrollmentWithDetails } from "@/src/services/enrollmentsService";
import { clientsService } from "@/src/services/clientsService";
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { showSuccessToast } from "@/src/lib/toast";
import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import type { RevenueBarPoint } from "@/src/data/paymentsData/revenueTrendBarData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

const STATUS_COLORS: Record<EnrollmentWithDetails["status"], string> = {
  active: "#376EF4",
  completed: "#3FC168",
};
const STATUS_LABELS: Record<EnrollmentWithDetails["status"], string> = {
  active: "Active",
  completed: "Completed",
};

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

// Total/pending revenue come from enrollments (the only place "amount due"
// or "package value" lives now) — a ledger row only knows what was paid.
function computeStats(enrollments: EnrollmentWithDetails[], payments: Payment[]): PaymentStat[] {
  const totalRevenue = enrollments.reduce((sum, e) => sum + e.packagePriceSnapshot, 0);
  const collected = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const pendingRevenue = enrollments
    .filter((e) => e.status === "active")
    .reduce((sum, e) => sum + e.amountDue, 0);

  const now = new Date();
  const monthlyRevenue = payments
    .filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, p) => sum + p.amountPaid, 0);

  return [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" },
    { label: "Monthly Revenue", value: formatCurrency(monthlyRevenue), iconColor: "#376EF4", iconBg: "rgba(55,110,244,0.1)" },
    { label: "Pending Revenue", value: formatCurrency(pendingRevenue), iconColor: "#F2A618", iconBg: "rgba(242,166,24,0.1)" },
    { label: "Collected", value: formatCurrency(collected), iconColor: "#3FC168", iconBg: "rgba(63,193,104,0.1)" },
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

  return months.map(({ key, label }) => {
    const revenue = payments
      .filter((p) => {
        const d = new Date(p.date);
        return `${d.getFullYear()}-${d.getMonth()}` === key;
      })
      .reduce((sum, p) => sum + p.amountPaid, 0);
    return { month: label, revenue };
  });
}

function computeStatusDistribution(enrollments: EnrollmentWithDetails[]): PaymentStatusSlice[] {
  const counts: Record<EnrollmentWithDetails["status"], number> = { active: 0, completed: 0 };
  for (const e of enrollments) counts[e.status] += 1;

  return (Object.keys(counts) as EnrollmentWithDetails["status"][])
    .filter((status) => counts[status] > 0)
    .map((status) => ({ status: STATUS_LABELS[status], value: counts[status], color: STATUS_COLORS[status] }));
}

export const usePayments = () => {
  const queryClient = useQueryClient();

  // Client name-lookup needs the full roster — a partial, scrolled-in page
  // of clients would leave later payments joined as "Unknown client".
  const { data: allClients = [] } = useQuery({
    queryKey: ["clients", "all", {}],
    queryFn: () => clientsService.fetchAllClients(),
  });
  const clientNameById = useMemo(
    () => new Map(allClients.map((c) => [c.id, c.name])),
    [allClients]
  );

  const {
    items: rawPayments,
    isLoading: isLoadingPayments,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList({
    queryKey: ["payments"],
    queryFn: (cursor) => paymentsService.fetchPayments(undefined, cursor),
  });
  const payments = useMemo(
    () =>
      rawPayments.map((p) => ({
        ...p,
        client: clientNameById.get(p.clientId) ?? "Unknown client",
      })),
    [rawPayments, clientNameById]
  );

  // Stats/charts need the FULL ledger (monthly revenue trend spans however
  // many payments fall in the last 6 months) — not just the visible page.
  const { data: allPaymentsRaw = [], isLoading: isLoadingAllPayments } = useQuery({
    queryKey: ["payments", "all"],
    queryFn: () => paymentsService.fetchAllPayments(),
  });
  const allPayments = useMemo(
    () =>
      allPaymentsRaw.map((p) => ({
        ...p,
        client: clientNameById.get(p.clientId) ?? "Unknown client",
      })),
    [allPaymentsRaw, clientNameById]
  );

  // Enrollments carry the "amount due" / "total paid" concept the old flat
  // payment rows used to fake with a due column — stats and the status
  // chart are computed from this, not from the ledger.
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: () => enrollmentsService.fetchAll(),
  });

  const isLoading = isLoadingPayments || isLoadingEnrollments || isLoadingAllPayments;

  const createPaymentMutation = useMutation({
    mutationFn: (payload: CreatePaymentPayload) => paymentsService.createPayment(payload),
    onSuccess: (result: CreatePaymentResult) => {
      showSuccessToast(result.isNewCycle ? "Started a new payment cycle" : "Payment recorded");
      if (result.enrollment.status === "completed") {
        showSuccessToast("Package completed ✅");
      }
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Lifetime value on the Clients page is derived from this same ledger.
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const createPayment = async (payload: CreatePaymentPayload) => {
    return await createPaymentMutation.mutateAsync(payload);
  };

  return {
    payments,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    stats: computeStats(enrollments, allPayments),
    revenueTrend: computeRevenueTrend(allPayments),
    statusDistribution: computeStatusDistribution(enrollments),
    createPayment,
  };
};
