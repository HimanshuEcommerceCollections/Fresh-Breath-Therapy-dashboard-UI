// Blob download helper for the CSV/PDF export endpoints.
//
// Goes through apiClient rather than window.open/an <a href> so the request
// carries the auth cookie and hits the same 401 -> re-verify -> redirect
// interceptor as everything else. A raw link would just render the JSON 401
// in a new tab.

import { apiClient } from "@/src/lib/apiClient";

export type ExportFormat = "csv" | "pdf";

function filenameFrom(disposition: string | undefined, fallback: string): string {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}

export async function downloadExport(
  path: string,
  params: Record<string, string | undefined>,
  fallbackName: string
): Promise<void> {
  const res = await apiClient.get<Blob>(path, {
    params,
    responseType: "blob",
  });

  const name = filenameFrom(
    res.headers?.["content-disposition"] as string | undefined,
    fallbackName
  );

  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoked on the next tick — revoking synchronously can cancel the download
  // in Safari before it has read the blob.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
