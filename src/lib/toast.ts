// src/lib/toast.ts
import { emitToast } from "@/src/lib/toastBus";

export const showSuccessToast = (message: string) => emitToast(message, "success");
export const showErrorToast = (message: string) => emitToast(message, "error");
