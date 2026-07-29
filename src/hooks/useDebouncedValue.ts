"use client";

import { useEffect, useState } from "react";

// Pure UI-timing utility — not server state, so it stays a plain hook rather
// than moving into React Query. Used to debounce search inputs before they
// become part of a query key (so typing doesn't fire a request per
// keystroke).
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
