// src/hooks/usePayments.ts
"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentsService,
  type Payment,
  type CreatePaymentPayload,
  type CreatePaymentResult,
} from "@/src/services/paymentsService";
import {
  enrollmentsService,
  PAYMENT_STATUS_LABELS,
  type Invoice,
  type PaymentStatus,
} from "@/src/services/enrollmentsService";
import { useInfiniteList } from "@/src/hooks/useInfiniteList";
import { showSuccessToast } from "@/src/lib/toast";
import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import type { RevenueBarPoint } from "@/src/data/paymentsData/revenueTrendBarData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

// Green paid / yellow partially paid / blue pending / red overdue — matches
// PaymentStatusSelect so the donut and the row badges agree.
const STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: "#16A34A",
  partially_paid: "#F2A618",
  pending: "#376EF4",
  overdue: "#EF4444",
};

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

// Totals come from invoices — a ledger row only knows what was handed over,
// not what the package costs or what's still outstanding.
function computeStats(invoices: Invoice[], payments: Payment[]): PaymentStat[] {
  const totalRevenue = invoices.reduce((s, e) => s + e.packagePriceSnapshot, 0);
  const collected = invoices.reduce((s, e) => s + e.totalPaid, 0);
  const pendingRevenue = invoices
    .filter((e) => e.paymentStatus !== "paid")
    .reduce((s, e) => s + e.amountDue, 0);

  const now = new Date();
  const monthlyRevenue = payments
    .filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, p) => s + p.amountPaid, 0);

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
      .reduce((s, p) => s + p.amountPaid, 0);
    return { month: label, revenue };
  });
}

function computeStatusDistribution(invoices: Invoice[]): PaymentStatusSlice[] {
  const counts: Record<PaymentStatus, number> = {
    paid: 0, partially_paid: 0, pending: 0, overdue: 0,
  };
  for (const e of invoices) counts[e.paymentStatus] += 1;

  return (Object.keys(counts) as PaymentStatus[])
    .filter((s) => counts[s] > 0)
    .map((s) => ({
      status: PAYMENT_STATUS_LABELS[s],
      value: counts[s],
      color: STATUS_COLORS[s],
    }));
}

export const usePayments = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | null>(null);

  const filters = useMemo(
    () => ({ paymentStatus: statusFilter ?? undefined }),
    [statusFilter]
  );

  // The table: one row per invoice, paged as the user scrolls.
  const {
    items: invoices,
    isLoading: isLoadingInvoices,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList({
    queryKey: ["enrollments", filters],
    queryFn: (cursor) => enrollmentsService.fetchInvoices(filters, cursor),
  });

  // Stats + donut span every invoice, not just the loaded pages.
  const { data: allInvoices = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ["enrollments", "all"],
    queryFn: () => enrollmentsService.fetchAllInvoices(),
  });

  // Monthly revenue and the 6-month trend need the payment ledger's dates.
  const { data: allPayments = [], isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments", "all"],
    queryFn: () => paymentsService.fetchAllPayments(),
  });

  const isLoading = isLoadingInvoices || isLoadingAll || isLoadingPayments;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    // Lifetime value on the Clients page is derived from this same ledger.
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const createPaymentMutation = useMutation({
    mutationFn: (payload: CreatePaymentPayload) => paymentsService.createPayment(payload),
    onSuccess: (result: CreatePaymentResult) => {
      showSuccessToast(result.isNewCycle ? "Started a new payment cycle" : "Payment recorded");
      if (result.enrollment.status === "completed") {
        showSuccessToast("Package completed ✅");
      }
      invalidate();
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: ({ clientId, packageId }: { clientId: string; packageId: string }) =>
      enrollmentsService.createInvoice(clientId, packageId),
    onSuccess: () => {
      showSuccessToast("Invoice created");
      invalidate();
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: string; status: PaymentStatus }) =>
      enrollmentsService.setPaymentStatus(invoiceId, status),
    onSuccess: (updated, variables) => {
      // The server re-derives anything other than Overdue, so report what it
      // actually settled on rather than what was clicked.
      if (variables.status !== "overdue" && updated.paymentStatus !== variables.status) {
        showSuccessToast(
          `Overdue cleared — now ${PAYMENT_STATUS_LABELS[updated.paymentStatus]} (from the amount paid)`
        );
      } else {
        showSuccessToast(`Marked ${PAYMENT_STATUS_LABELS[updated.paymentStatus]}`);
      }
      invalidate();
    },
  });

  return {
    invoices,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    statusFilter,
    setStatusFilter,
    stats: computeStats(allInvoices, allPayments),
    revenueTrend: computeRevenueTrend(allPayments),
    statusDistribution: computeStatusDistribution(allInvoices),
    createPayment: createPaymentMutation.mutateAsync,
    createInvoice: (clientId: string, packageId: string) =>
      createInvoiceMutation.mutateAsync({ clientId, packageId }),
    setPaymentStatus: (invoiceId: string, status: PaymentStatus) =>
      setStatusMutation.mutateAsync({ invoiceId, status }),
  };
};
