// src/services/enrollmentsService.ts
//
// An Enrollment is one client's purchase-cycle of one package — the
// aggregate the Record Payment modal reads to auto-populate "paid so far" /
// "amount due" instead of ever asking the admin to type either. Payments
// (paymentsService.ts) are the immutable ledger of individual installments
// recorded against an enrollment.

import { AxiosError } from "axios";
import { apiClient } from "@/src/lib/apiClient";

export type EnrollmentStatus = "active" | "completed";

export interface Enrollment {
  id: string;
  clientId: string;
  packageId: string;
  packagePriceSnapshot: number;
  totalPaid: number;
  amountDue: number;
  status: EnrollmentStatus;
  startedAt: string;
  completedAt: string | null;
}

export interface EnrollmentWithDetails extends Enrollment {
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
  started_at: string;
  completed_at: string | null;
}

interface ApiEnrollmentWithDetails extends ApiEnrollment {
  client: { id: string; name: string };
  package: { id: string; name: string; price: number; is_active: boolean };
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
    startedAt: raw.started_at,
    completedAt: raw.completed_at,
  };
}

function is404(err: unknown): boolean {
  return err instanceof AxiosError && err.response?.status === 404;
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

  async fetchAll(statusFilter?: EnrollmentStatus): Promise<EnrollmentWithDetails[]> {
    const res = await apiClient.get<ApiEnrollmentWithDetails[]>("/api/enrollments", {
      params: statusFilter ? { status_filter: statusFilter } : undefined,
    });
    return res.data.map((raw) => ({
      ...toEnrollment(raw),
      clientName: raw.client.name,
      packageName: raw.package.name,
      packagePrice: raw.package.price,
    }));
  },
};
