// src/hooks/useRequireRole.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import type { RoleName } from "@/src/services/authService";

// Page-level guard: redirects away once the role check resolves and the
// current role isn't in `allowedRoles`. Returns `isChecking` so the caller
// can render nothing (or a loading state) until the redirect fires, instead
// of flashing restricted content.
export function useRequireRole(allowedRoles: RoleName[], redirectTo = "/") {
  const { role, hasChecked } = useCurrentUser();
  const router = useRouter();

  const isAllowed = role !== null && allowedRoles.includes(role);

  useEffect(() => {
    if (hasChecked && !isAllowed) {
      router.replace(redirectTo);
    }
  }, [hasChecked, isAllowed, redirectTo, router]);

  return { isChecking: !hasChecked || !isAllowed };
}
