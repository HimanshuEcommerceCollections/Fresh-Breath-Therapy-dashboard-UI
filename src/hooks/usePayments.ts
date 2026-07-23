// src/hooks/usePayments.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  paymentsService,
  type Payment,
  type CreatePaymentPayload,
} from "@/src/services/paymentsService";
import { clientsService } from "@/src/services/clientsService";
import { showSuccessToast } from "@/src/lib/toast";
import type { PaymentStat } from "@/src/data/paymentsData/paymentsStatsData";
import type { RevenueBarPoint } from "@/src/data/paymentsData/revenueTrendBarData";
import type { PaymentStatusSlice } from "@/src/data/dashboardData/paymentStatusData";

const STATUS_COLORS: Record<Payment["status"], string> = {
  Paid: "#3FC168",
  "Partially Paid": "#F2A618",
  Pending: "#376EF4",
  Overdue: "#F22A36",
};

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}

// Client-computed — see the MISMATCH note at the top of paymentsService.ts.
function computeStats(payments: Payment[]): PaymentStat[] {
  const totalRevenue = payments.reduce((sum, p) => sum + p.due, 0);
  const collected = payments.reduce((sum, p) => sum + p.paid, 0);
  const pendingRevenue = payments.reduce((sum, p) => sum + p.balance, 0);

  const now = new Date();
  const monthlyRevenue = payments
    .filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, p) => sum + p.due, 0);

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
      .reduce((sum, p) => sum + p.paid, 0);
    return { month: label, revenue };
  });
}

function computeStatusDistribution(payments: Payment[]): PaymentStatusSlice[] {
  const counts = new Map<Payment["status"], number>();
  for (const p of payments) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  return Array.from(counts.entries()).map(([status, value]) => ({
    status,
    value,
    color: STATUS_COLORS[status],
  }));
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rawPayments, clients] = await Promise.all([
        paymentsService.fetchPayments(),
        clientsService.fetchClients(),
      ]);
      const clientNameById = new Map(clients.map((c) => [c.id, c.name]));
      setPayments(
        rawPayments.map((p) => ({
          ...p,
          client: clientNameById.get(p.clientId) ?? "Unknown client",
        }))
      );
    } catch {
      // Error toast already surfaced by the apiClient interceptor.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createPayment = async (payload: CreatePaymentPayload) => {
    await paymentsService.createPayment(payload);
    showSuccessToast("Payment recorded");
    await load();
  };

  return {
    payments,
    isLoading,
    stats: computeStats(payments),
    revenueTrend: computeRevenueTrend(payments),
    statusDistribution: computeStatusDistribution(payments),
    createPayment,
  };
};
