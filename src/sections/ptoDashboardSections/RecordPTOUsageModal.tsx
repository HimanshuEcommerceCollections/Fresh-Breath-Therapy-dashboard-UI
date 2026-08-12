"use client";

// src/sections/ptoDashboardSections/RecordPTOUsageModal.tsx
//
// The one place PTO *used* enters the system.
//
// Accrual is automatic — 0.04h per completed session, appended to the ledger
// by the sessions router. Nothing in the product knows a therapist took a day
// off, so "used" has no automatic source and every other figure on this
// dashboard depends on it: balance is accrued-minus-used, so with no way to
// record usage, "PTO Used" and "Balance" were structurally stuck at 0 and the
// leaderboard's ranking-by-balance was ranking by accrual.
//
// Admin-only, matching POST /api/pto/usage.

import { useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";
import FormField from "@/src/sections/leadsSections/FormField";
import TherapistSelect from "@/src/components/sharedComponents/TherapistSelect";
import { useTherapistPTOTransactions } from "@/src/hooks/usePTODashboard";
import type { PTOLeaderboardEntry, RecordPTOUsagePayload } from "@/src/services/ptoService";

// Rendered only while open — the caller mounts it conditionally. That's what
// resets the form: an effect that cleared the fields on `open` going false
// would be a setState in an effect body (which the React Compiler rightly
// rejects), and leaving them would let a reopened modal inherit a half-filled
// entry — an easy way to file leave against the wrong therapist.
export default function RecordPTOUsageModal({
  onClose,
  onSubmit,
  isSubmitting,
  leaderboard,
}: {
  onClose: () => void;
  onSubmit: (payload: RecordPTOUsagePayload) => Promise<unknown>;
  isSubmitting: boolean;
  /** Source of the live balance shown against the chosen therapist. */
  leaderboard: PTOLeaderboardEntry[];
}) {
  const [therapistId, setTherapistId] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const { transactions, isLoading: isLoadingLedger } =
    useTherapistPTOTransactions(therapistId || null);

  const entry = useMemo(
    () => leaderboard.find((e) => e.therapistId === therapistId) ?? null,
    [leaderboard, therapistId],
  );

  const balance = entry?.balance ?? 0;
  const hoursNum = Number(hours);
  const hasHours = hours.trim() !== "" && Number.isFinite(hoursNum) && hoursNum > 0;

  // Checked here as well as server-side. The backend is the authority — it
  // recomputes the balance inside the request, so it catches the case where
  // someone else logged leave while this modal sat open — but failing at the
  // point of typing beats a round trip and a toast.
  const exceedsBalance = hasHours && hoursNum > balance;
  const isValid = Boolean(therapistId) && hasHours && Boolean(date) && !exceedsBalance;

  async function handleSubmit() {
    if (!isValid || isSubmitting) return;
    try {
      await onSubmit({
        therapistId,
        hours: hoursNum,
        date,
        reason: reason.trim() || undefined,
      });
      onClose();
    } catch {
      // The apiClient interceptor already surfaces the server's message (e.g.
      // "only has 8h balance"). Swallowed here so the modal stays open with
      // the admin's input intact rather than closing on a failure.
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex w-full max-w-[480px] flex-col rounded-2xl bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-[#0F172A]">Record PTO used</h2>
            <p className="text-xs text-[#596475]">
              Accrual is automatic; leave taken is entered here
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer text-[#94A3B8] transition-colors hover:text-[#64748B]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <TherapistSelect
            label="Therapist"
            value={therapistId}
            onChange={setTherapistId}
            shellClassName="h-10 rounded-lg border border-[#C3C6D7] bg-[#F8F9FF] focus:ring-2 focus:ring-[#325A5E]/30"
          />

          {/* Balance context. Without it the admin is typing hours against a
              number they'd have to leave the modal to look up. */}
          {therapistId && entry && (
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#434655]">Available balance</span>
                <span className="font-semibold tabular-nums text-[#0B1C30]">
                  {balance}h
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-[#94A3B8]">
                <span>
                  {entry.ptoAccrued}h accrued · {entry.ptoUsed}h used
                </span>
                <span>{entry.ytdSessions} sessions YTD</span>
              </div>
              {balance === 0 && (
                <p className="mt-2 text-xs text-[#9A611D]">
                  No balance yet — PTO accrues at 0.04h per completed session,
                  so a therapist with no completed sessions has nothing to draw
                  on.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <FormField
              label="Hours used"
              type="number"
              min={0}
              step="0.25"
              placeholder="8"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              error={exceedsBalance ? `Only ${balance}h available` : undefined}
            />
            <FormField
              label="Date taken"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <FormField
            label="Reason (optional)"
            type="text"
            placeholder="Vacation, sick leave…"
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          {/* Recent ledger for the chosen therapist — the rows behind the
              totals above, so a balance that looks wrong can be traced. */}
          {therapistId && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.6px] text-[#434655]">
                Recent PTO records
              </span>
              <div className="max-h-36 overflow-y-auto rounded-lg border border-[#E2E8F0] bg-white">
                {isLoadingLedger ? (
                  <p className="flex items-center justify-center gap-2 px-3 py-4 text-xs text-[#596475]">
                    <Loader2 size={13} className="animate-spin" />
                    Loading records…
                  </p>
                ) : transactions.length === 0 ? (
                  <p className="px-3 py-4 text-center text-xs text-[#94A3B8]">
                    No PTO records yet for this therapist.
                  </p>
                ) : (
                  transactions.slice(0, 25).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-2 border-b border-[#F1F5F9] px-3 py-2 text-xs last:border-b-0"
                    >
                      <span className="min-w-0 truncate text-[#434655]">
                        {t.type === "usage" ? "Used" : "Accrued"}
                        {t.date ? ` · ${t.date}` : ""}
                        {t.reason ? ` · ${t.reason}` : ""}
                      </span>
                      <span
                        className={`shrink-0 font-semibold tabular-nums ${
                          t.type === "usage" ? "text-[#C70036]" : "text-[#007A55]"
                        }`}
                      >
                        {t.type === "usage" ? "−" : "+"}
                        {t.hours}h
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center rounded-lg border border-[#C3C6D7] px-4 text-sm font-medium text-[#434655] transition-colors hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#376EF4] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Recording…" : "Record PTO used"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
