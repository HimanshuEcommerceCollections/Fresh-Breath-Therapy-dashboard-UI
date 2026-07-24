"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { subscribeToasts, type ToastMessage } from "@/src/lib/toastBus";

const AUTO_DISMISS_MS = 4000;

export default function ToastViewport() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, AUTO_DISMISS_MS);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-100 flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const isError = toast.variant === "error";
        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] ${
              isError
                ? "border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]"
                : "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
            }`}
          >
            {isError ? (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
