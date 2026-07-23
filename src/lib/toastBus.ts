// src/lib/toastBus.ts
//
// Minimal pub-sub so plain modules (apiClient's interceptor, authService)
// can trigger a toast without needing React context/hooks — only
// ToastViewport (a component) subscribes, to actually render them.

export type ToastVariant = "success" | "error";

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();
let nextId = 0;

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitToast(message: string, variant: ToastVariant = "success") {
  nextId += 1;
  const toast: ToastMessage = { id: `toast-${nextId}`, message, variant };
  listeners.forEach((listener) => listener(toast));
}
