"use client";

// RemovalBlockedModal — shown when revoking an approved account is refused
// because the account is linked to a therapist who is still active. The
// admin has to mark that therapist inactive on the Therapists page first;
// only then can the account's access be removed.

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";

export default function RemovalBlockedModal({
  message,
  therapistName,
  onClose,
}: {
  message: string;
  therapistName: string;
  onClose: () => void;
}) {
  return (
    <ModalOverlay onClose={onClose}>
      <div
        role="alertdialog"
        aria-labelledby="removal-blocked-title"
        className="flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={20} strokeWidth={2} />
          </span>
          <h2 id="removal-blocked-title" className="text-lg font-bold text-[#0F172A]">
            Request failed
          </h2>
        </div>
        <p className="mt-3 text-sm text-[#596475]">{message}</p>
        <p className="mt-2 text-sm text-[#596475]">
          Open the Therapists page, edit <span className="font-semibold">{therapistName}</span> and
          set them to inactive. Then come back here to remove this account&apos;s access.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-[#434655] transition-colors hover:bg-black/4"
          >
            Close
          </button>
          <Link
            href="/therapists"
            className="cursor-pointer rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Go to Therapists
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
}
