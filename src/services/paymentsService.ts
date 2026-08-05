// src/services/paymentsService.ts
//
// Payments are an immutable ledger: each row records one installment
// against an Enrollment (see enrollmentsService.ts). The admin only ever
// types the amount being paid *this* installment — due/paid totals are
// derived and maintained by the backend (routers/payments.py), never
// entered by hand here.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import { fetchAllPages, type Page } from "@/src/lib/pagination";
import type { PaymentMethod } from "@/src/data/paymentsData/paymentsData";
import { toEnrollment, type Enrollment, type ApiEnrollment } from "@/src/services/enrollmentsService";

type ApiPaymentMethod = "credit_card" | "ach" | "cash" | "insurance";

const METHOD_TO_LABEL: Record<ApiPaymentMethod, PaymentMethod> = {
  credit_card: "Credit Card",
  ach: "ACH",
  cash: "Cash",
  insurance: "Insurance",
};
const LABEL_TO_METHOD: Record<PaymentMethod, ApiPaymentMethod> = {
  "Credit Card": "credit_card",
  ACH: "ach",
  Cash: "cash",
  Insurance: "insurance",
};

export interface Payment {
  id: string;
  enrollmentId: string;
  clientId: string;
  client: string;
  packageId: string;
  packageName: string;
  amountPaid: number;
  balanceAfter: number;
  method: PaymentMethod;
  date: string;
  createdAt: string;
  enrollment: Enrollment;
}

export interface CreatePaymentPayload {
  clientId: string;
  packageId: string;
  amountPaid: number;
  method: PaymentMethod;
  date: string;
}

export interface CreatePaymentResult {
  payment: Payment;
  enrollment: Enrollment;
  isNewCycle: boolean;
}

interface ApiPayment {
  id: string;
  enrollment_id: string;
  client_id: string;
  amount_paid: number;
  balance_after: string;
  method: ApiPaymentMethod;
  date: string;
  created_at: string;
  package: { id: string; name: string; price: number; is_active: boolean };
  enrollment: ApiEnrollment;
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

interface ApiPaymentCreateResult {
  payment: ApiPayment;
  enrollment: ApiEnrollment;
  is_new_cycle: boolean;
}

function toPayment(raw: ApiPayment): Payment {
  return {
    id: raw.id,
    enrollmentId: raw.enrollment_id,
    clientId: raw.client_id,
    client: "",
    packageId: raw.package.id,
    packageName: `${raw.package.name} — $${raw.package.price.toLocaleString()}`,
    amountPaid: Number(raw.amount_paid),
    balanceAfter: parseFloat(raw.balance_after),
    method: METHOD_TO_LABEL[raw.method],
    date: raw.date,
    createdAt: raw.created_at,
    enrollment: toEnrollment(raw.enrollment),
  };
}

export const paymentsService = {
  async fetchPayments(clientId?: string, cursor?: string, limit?: number): Promise<Page<Payment>> {
    const res = await apiClient.get<ApiPage<ApiPayment>>("/api/payments", {
      params: { client_id: clientId || undefined, cursor, limit },
    });
    return {
      items: res.data.items.map(toPayment),
      nextCursor: res.data.next_cursor,
      hasMore: res.data.has_more,
    };
  },

  // Stats/charts (total revenue, monthly trend) need every payment in the
  // ledger, not just whatever page the table has scrolled into.
  async fetchAllPayments(clientId?: string): Promise<Payment[]> {
    return fetchAllPages((cursor) => paymentsService.fetchPayments(clientId, cursor, 100));
  },

  async createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResult> {
    const res = await apiClient.post<ApiPaymentCreateResult>(
      "/api/payments",
      {
        client_id: payload.clientId,
        package_id: payload.packageId,
        amount_paid: payload.amountPaid,
        method: LABEL_TO_METHOD[payload.method],
        date: payload.date,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return {
      payment: toPayment(res.data.payment),
      enrollment: toEnrollment(res.data.enrollment),
      isNewCycle: res.data.is_new_cycle,
    };
  },

  async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(`/api/payments/${paymentId}`);
  },
};
