// src/services/paymentsService.ts
//
// One payment = what one session cost and whether it has been settled.
//
// This used to be an immutable ledger of installments against an Enrollment
// (a client's purchase-cycle of a Package), with due/paid/balance totals the
// backend maintained. The practice does not sell packages, so enrollments and
// packages are gone and a payment is now an amount, a method and a status.

import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import { fetchAllPages, type Page } from "@/src/lib/pagination";
import {
  LABEL_TO_METHOD,
  LABEL_TO_STATUS,
  METHOD_TO_LABEL,
  STATUS_TO_LABEL,
  type ApiPaymentMethod,
  type ApiPaymentStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/data/paymentsData/paymentVocabulary";

export interface Payment {
  id: string;
  clientId: string;
  /** The client's name, for the table and the search box. */
  client: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  createdAt: string;
}

export interface PaymentFilters {
  clientId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  search?: string;
}

export interface UpdatePaymentPayload {
  amount?: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  date?: string;
}

/** Only used by the session-scheduling flow — the Payments page cannot
 *  create a payment, because a payment without a session has nothing to be
 *  for. See routers/sessions.py. */
export interface CreatePaymentPayload {
  clientId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

interface ApiPayment {
  id: string;
  client_id: string;
  amount: string;
  method: ApiPaymentMethod;
  status: ApiPaymentStatus;
  date: string;
  created_at: string;
  updated_at: string;
  client: { id: string; name: string };
}

function toPayment(raw: ApiPayment): Payment {
  return {
    id: raw.id,
    clientId: raw.client_id,
    client: raw.client?.name ?? "",
    // Numeric(10,2) serialises as a string; parseFloat, not Number(), for
    // consistency with how the rest of the services read money.
    amount: parseFloat(raw.amount),
    method: METHOD_TO_LABEL[raw.method],
    status: STATUS_TO_LABEL[raw.status],
    date: raw.date,
    createdAt: raw.created_at,
  };
}

export const paymentsService = {
  async fetchPayments(
    filters?: PaymentFilters,
    cursor?: string,
    limit?: number,
  ): Promise<Page<Payment>> {
    const res = await apiClient.get<ApiPage<ApiPayment>>("/api/payments", {
      params: {
        client_id: filters?.clientId || undefined,
        status_filter: filters?.status ? LABEL_TO_STATUS[filters.status] : undefined,
        method: filters?.method ? LABEL_TO_METHOD[filters.method] : undefined,
        search: filters?.search || undefined,
        cursor,
        limit,
      },
    });
    return {
      items: res.data.items.map(toPayment),
      nextCursor: res.data.next_cursor,
      hasMore: res.data.has_more,
    };
  },

  // The stat cards and the charts need every payment, not just the page the
  // table has scrolled into.
  async fetchAllPayments(filters?: PaymentFilters): Promise<Payment[]> {
    return fetchAllPages((cursor) => paymentsService.fetchPayments(filters, cursor, 100));
  },

  async createPayment(payload: CreatePaymentPayload): Promise<Payment> {
    const res = await apiClient.post<ApiPayment>(
      "/api/payments",
      {
        client_id: payload.clientId,
        amount: payload.amount,
        method: LABEL_TO_METHOD[payload.method],
        status: LABEL_TO_STATUS[payload.status],
        date: payload.date,
      },
      { idempotent: true, idempotencyKey: newIdempotencyKey() },
    );
    return toPayment(res.data);
  },

  async updatePayment(paymentId: string, payload: UpdatePaymentPayload): Promise<Payment> {
    const res = await apiClient.patch<ApiPayment>(`/api/payments/${paymentId}`, {
      amount: payload.amount,
      method: payload.method ? LABEL_TO_METHOD[payload.method] : undefined,
      status: payload.status ? LABEL_TO_STATUS[payload.status] : undefined,
      date: payload.date,
    });
    return toPayment(res.data);
  },

  async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(`/api/payments/${paymentId}`);
  },
};
