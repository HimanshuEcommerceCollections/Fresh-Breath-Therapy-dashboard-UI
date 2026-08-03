"use client";

import { useState } from "react";
import ModalOverlay from "@/src/sections/leadsSections/ModalOverlay";

export default function ConfirmDeleteModal({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ModalOverlay onClose={onCancel}>
      <div className="flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
        <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
        <p className="mt-2 text-sm text-[#596475]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-[#434655] transition-colors hover:bg-black/4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
