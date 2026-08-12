// src/hooks/useCurrentUser.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isRequestCancelled, isUnauthenticatedError } from "@/src/lib/apiClient";
import { sessionAuthService, type CurrentUser, type RoleName } from "@/src/services/authService";
import { therapistsService, type Therapist } from "@/src/services/therapistsService";

interface CurrentUserContextValue {
  user: CurrentUser | null;
  role: RoleName | null;
  isLoading: boolean;
  /** Resolved once the initial GET /api/auth/me call finishes (success or
   * failure) — distinguishes "still checking" from "checked, not logged in." */
  hasChecked: boolean;
  // Role-agnostic: any logged-in user (Admin, Coordinator, or Therapist)
  // MAY be linked to a Therapist record, matched by email — this is that
  // match, computed client-side since GET /api/auth/me doesn't expose a
  // linked-therapist field. A genuine Therapist-role account always has a
  // match, since role-request approval only ever grants that role because
  // one already exists (see role_request approval logic backend-side).
  linkedTherapist: Therapist | null;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [linkedTherapist, setLinkedTherapist] = useState<Therapist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await sessionAuthService.me();
      setUser(currentUser);
      setHasChecked(true);

      try {
        const therapists = await therapistsService.fetchTherapists();
        setLinkedTherapist(
          therapists.find(
            (t) => t.email.toLowerCase() === currentUser.email.toLowerCase()
          ) ?? null
        );
      } catch (error) {
        // An aborted lookup tells us nothing about whether they're linked,
        // so keep whatever we already knew rather than dropping the card.
        if (!isRequestCancelled(error)) setLinkedTherapist(null);
      }
    } catch (error) {
      // ONLY a 401 or 404 clears the session.
      //
      // Everything else — a 500, a gateway error, a timeout, a dropped
      // connection, a cancelled request — means the question could not be
      // asked, not that the answer was no. Clearing `user` on those is what
      // dumped people on /login every time the API hiccuped, mid-session,
      // with a perfectly valid cookie.
      //
      // hasChecked is deliberately left alone too: the shell waits on it, so
      // an unanswered probe shows the loading state and the next navigation
      // re-runs this and gets a real answer, rather than bouncing to /login.
      if (!isUnauthenticatedError(error)) {
        if (!isRequestCancelled(error)) {
          console.warn("[auth] /me failed without a verdict; session kept", error);
        }
        return;
      }
      setUser(null);
      setLinkedTherapist(null);
      setHasChecked(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await sessionAuthService.logout();
    setUser(null);
    setLinkedTherapist(null);
  };

  return (
    <CurrentUserContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isLoading,
        hasChecked,
        linkedTherapist,
        refetch: load,
        logout,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return ctx;
}
