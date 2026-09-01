// src/services/paymentsService.ts
//
// One payment = what one session cost and whether it has been settled.
//
// A payment hangs off the SESSION it paid for, and the session names the
// person — who may be a lead. That is why there is no clientId here, and why
// converting a lead carries their payments across for free.
//
// There is no create: payments are written by POST /api/sessions in the same
// transaction as the session. This service reads, edits and deletes.

import { apiClient } from "@/src/lib/apiClient";
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
  /** Who the payment is for, read off its session — may be a lead. */
  subject: { id: string; name: string; kind: "lead" | "client" };
  /** The appointment that was paid for. */
  session: { id: string; date: string; type: string };
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

/** The money half of scheduling a session, sent nested inside the session
 *  payload. There is no standalone create endpoint: a payment without a
 *  session has nothing to be for. See sessionsService.scheduleSession. */
export interface PaymentDetails {
  amount: number;
  method: PaymentMethod;
  /** Defaults to Pending — the admin marks it Paid when the money arrives. */
  status: PaymentStatus;
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

interface ApiPayment {
  id: string;
  amount: string;
  method: ApiPaymentMethod;
  status: ApiPaymentStatus;
  date: string;
  created_at: string;
  updated_at: string;
  subject: { id: string; name: string; kind: "lead" | "client" };
  session: { id: string; date: string; type: string };
}

function toPayment(raw: ApiPayment): Payment {
  return {
    id: raw.id,
    subject: raw.subject,
    session: raw.session,
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
