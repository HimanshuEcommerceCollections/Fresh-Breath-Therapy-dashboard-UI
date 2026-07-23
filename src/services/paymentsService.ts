// src/services/paymentsService.ts
//
// Wired to the real backend per FBT_Backend_API_Reference.docx section 10.
// `balance` is COMPUTED server-side; `due`/`date` are immutable once
// created (PATCH only allows paid/method/status).
//
// MISMATCH (flagged): section 10 only documents a `client_id` filter for
// GET /api/payments — no dedicated revenue-stats or chart-data endpoint
// exists for this resource (that aggregation only exists under Dashboard's
// /api/dashboard, section 12). The stats row and both charts on the
// Payments page are therefore computed client-side from the fetched
// payments list in usePayments.ts, not from a backend aggregate. "Total
// Revenue" mirrors section 12's own definition (sum of Payment.due);
// "Monthly Revenue"/"Pending Revenue" are reasonable analogues, not
// backend-defined terms for this endpoint.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import type { PaymentMethod, PaymentStatus } from "@/src/data/paymentsData/paymentsData";

type ApiPaymentMethod = "credit_card" | "ach" | "cash" | "insurance";
type ApiPaymentStatus = "paid" | "partially_paid" | "pending" | "overdue";

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

const STATUS_TO_LABEL: Record<ApiPaymentStatus, PaymentStatus> = {
  paid: "Paid",
  partially_paid: "Partially Paid",
  pending: "Pending",
  overdue: "Overdue",
};
const LABEL_TO_STATUS: Record<PaymentStatus, ApiPaymentStatus> = {
  Paid: "paid",
  "Partially Paid": "partially_paid",
  Pending: "pending",
  Overdue: "overdue",
};

export interface Payment {
  id: string;
  clientId: string;
  client: string;
  packageId: string;
  packageName: string;
  due: number;
  paid: number;
  balance: number;
  method: PaymentMethod;
  date: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface CreatePaymentPayload {
  clientId: string;
  packageId: string;
  due: number;
  paid?: number;
  method: PaymentMethod;
  date: string;
  status?: PaymentStatus;
}

export interface UpdatePaymentPayload {
  paid?: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
}

interface ApiPayment {
  id: string;
  due: number;
  paid: number;
  method: ApiPaymentMethod;
  date: string;
  status: ApiPaymentStatus;
  created_at: string;
  client_id: string;
  package: { id: string; name: string; price: number; is_active: boolean };
  balance: string;
}

function toPayment(raw: ApiPayment): Payment {
  return {
    id: raw.id,
    clientId: raw.client_id,
    client: "",
    packageId: raw.package.id,
    packageName: `${raw.package.name} — $${raw.package.price.toLocaleString()}`,
    due: raw.due,
    paid: raw.paid,
    balance: parseFloat(raw.balance),
    method: METHOD_TO_LABEL[raw.method],
    date: raw.date,
    status: STATUS_TO_LABEL[raw.status],
    createdAt: raw.created_at,
  };
}

export const paymentsService = {
  async fetchPayments(clientId?: string): Promise<Payment[]> {
    const res = await apiClient.get<ApiPayment[]>("/api/payments", {
      params: clientId ? { client_id: clientId } : undefined,
    });
    return res.data.map(toPayment);
  },

  async createPayment(payload: CreatePaymentPayload): Promise<Payment> {
    const res = await apiClient.post<ApiPayment>(
      "/api/payments",
      {
        client_id: payload.clientId,
        package_id: payload.packageId,
        due: payload.due,
        paid: payload.paid,
        method: LABEL_TO_METHOD[payload.method],
        date: payload.date,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toPayment(res.data);
  },

  async updatePayment(paymentId: string, payload: UpdatePaymentPayload): Promise<Payment> {
    const res = await apiClient.patch<ApiPayment>(
      `/api/payments/${paymentId}`,
      {
        paid: payload.paid,
        method: payload.method ? LABEL_TO_METHOD[payload.method] : undefined,
        status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toPayment(res.data);
  },

  async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(`/api/payments/${paymentId}`);
  },
};
