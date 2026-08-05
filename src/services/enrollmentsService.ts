// src/services/enrollmentsService.ts
//
// An Enrollment is one client's purchase-cycle of one package — and it is
// what the Payments table renders one row per: the INVOICE, carrying
// Due / Paid / Balance / Status. Payments (paymentsService.ts) are the
// immutable ledger of individual installments recorded against an invoice.
//
// The four displayed statuses are NOT four stored values. paid /
// partially_paid / pending are derived server-side from the money, so the
// badge can never contradict the ledger; only `overdue` is a stored,
// admin-set flag. Picking any non-overdue option clears that flag and lets
// the status fall back to whatever's been paid — see setPaymentStatus.

import { AxiosError } from "axios";
import { apiClient, newIdempotencyKey } from "@/src/lib/apiClient";
import { fetchAllPages, type Page } from "@/src/lib/pagination";

export type EnrollmentStatus = "active" | "completed";
export type PaymentStatus = "paid" | "partially_paid" | "pending" | "overdue";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  partially_paid: "Partially Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const PAYMENT_STATUS_ORDER: PaymentStatus[] = [
  "paid",
  "partially_paid",
  "pending",
  "overdue",
];

export interface Enrollment {
  id: string;
  clientId: string;
  packageId: string;
  packagePriceSnapshot: number;
  totalPaid: number;
  amountDue: number;
  status: EnrollmentStatus;
  isOverdue: boolean;
  paymentStatus: PaymentStatus;
  startedAt: string;
  completedAt: string | null;
}

/** One row of the Payments table. */
export interface Invoice extends Enrollment {
  clientName: string;
  packageName: string;
  packagePrice: number;
}

export interface ApiEnrollment {
  id: string;
  client_id: string;
  package_id: string;
  package_price_snapshot: string;
  total_paid: string;
  amount_due: string;
  status: EnrollmentStatus;
  is_overdue: boolean;
  payment_status: PaymentStatus;
  started_at: string;
  completed_at: string | null;
}

interface ApiInvoice extends ApiEnrollment {
  client: { id: string; name: string };
  package: { id: string; name: string; price: number; is_active: boolean };
}

interface ApiPage<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export function toEnrollment(raw: ApiEnrollment): Enrollment {
  return {
    id: raw.id,
    clientId: raw.client_id,
    packageId: raw.package_id,
    packagePriceSnapshot: parseFloat(raw.package_price_snapshot),
    totalPaid: parseFloat(raw.total_paid),
    amountDue: parseFloat(raw.amount_due),
    status: raw.status,
    isOverdue: raw.is_overdue,
    paymentStatus: raw.payment_status,
    startedAt: raw.started_at,
    completedAt: raw.completed_at,
  };
}

function toInvoice(raw: ApiInvoice): Invoice {
  return {
    ...toEnrollment(raw),
    clientName: raw.client.name,
    packageName: raw.package.name,
    packagePrice: raw.package.price,
  };
}

function is404(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 404;
}

export interface InvoiceFilters {
  paymentStatus?: PaymentStatus;
  clientId?: string;
}

export const enrollmentsService = {
  /** Null means "no active cycle yet" — the caller (Record Payment modal)
   * treats that as a fresh first installment: amount due = full package
   * price, paid so far = 0. Not a real error, so the 404 toast is suppressed. */
  async lookupActive(clientId: string, packageId: string): Promise<Enrollment | null> {
    try {
      const res = await apiClient.get<ApiEnrollment>("/api/enrollments/lookup", {
        params: { client_id: clientId, package_id: packageId },
        skipErrorToast: true,
      });
      return toEnrollment(res.data);
    } catch (err) {
      if (is404(err)) return null;
      throw err;
    }
  },

  /** Every enrollment (any status) for this client+package, newest first —
   * used to tell "never enrolled before" apart from "the last cycle already
   * completed" so the Record Payment modal can show the right messaging. */
  async fetchHistory(clientId: string, packageId: string): Promise<Enrollment[]> {
    const res = await apiClient.get<ApiEnrollment[]>("/api/enrollments/history", {
      params: { client_id: clientId, package_id: packageId },
    });
    return res.data.map(toEnrollment);
  },

  async fetchInvoices(
    filters?: InvoiceFilters,
    cursor?: string,
    limit?: number
  ): Promise<Page<Invoice>> {
    const res = await apiClient.get<ApiPage<ApiInvoice>>("/api/enrollments", {
      params: {
        payment_status: filters?.paymentStatus || undefined,
        client_id: filters?.clientId || undefined,
        cursor,
        limit,
      },
    });
    return {
      items: res.data.items.map(toInvoice),
      nextCursor: res.data.next_cursor,
      hasMore: res.data.has_more,
    };
  },

  /** Stats and the status donut are computed across every invoice, not just
   * the page that has scrolled into view. */
  async fetchAllInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    return fetchAllPages((cursor) =>
      enrollmentsService.fetchInvoices(filters, cursor, 100)
    );
  },

  /** Assign a package to a client with no payment yet — the invoice starts at
   * Due = full price, Paid = 0, which renders as Pending. */
  async createInvoice(clientId: string, packageId: string): Promise<Invoice> {
    const res = await apiClient.post<ApiInvoice>(
      "/api/enrollments",
      { client_id: clientId, package_id: packageId },
      { idempotent: true, idempotencyKey: newIdempotencyKey() }
    );
    return toInvoice(res.data);
  },

  /** Only "overdue" is persisted. Sending any of the other three clears the
   * overdue flag, and the server returns the RE-DERIVED status — which may
   * differ from what was clicked (marking a $0 invoice "Paid" comes back as
   * "Pending"). Callers should render what comes back, not what was sent. */
  async setPaymentStatus(enrollmentId: string, status: PaymentStatus): Promise<Invoice> {
    const res = await apiClient.patch<ApiInvoice>(
      `/api/enrollments/${enrollmentId}/status`,
      { status }
    );
    return toInvoice(res.data);
  },

  async deleteInvoice(enrollmentId: string): Promise<void> {
    await apiClient.delete(`/api/enrollments/${enrollmentId}`);
  },
};
