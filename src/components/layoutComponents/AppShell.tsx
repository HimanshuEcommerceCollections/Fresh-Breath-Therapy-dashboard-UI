"use client";

// src/components/layoutComponents/AppShell.tsx
//
// Splits the app into a public shell (auth pages — no Sidebar/Header, no
// authenticated polling) and a protected shell (everything else — requires
// a real session, redirects to /login otherwise).

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import Sidebar from "@/src/components/layoutComponents/Sidebar/Sidebar";
import Header from "@/src/components/layoutComponents/Header/Header";

const PUBLIC_ROUTES = ["/login", "/signup", "/verify-otp"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <ProtectedShell>{children}</ProtectedShell>;
}

function ProtectedShell({ children }: { children: React.ReactNode }) {
  const { hasChecked, user, refetch } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const isFirstPathname = useRef(true);

  // CurrentUserProvider only checks /api/auth/me once, on initial app load —
  // a client-side route change never re-verifies on its own. Without this, a
  // session that goes stale while the SPA is open (expired, logged out in
  // another tab, revoked) would keep rendering pages from the last-known
  // `user` in memory until some unrelated API call happened to 401. Re-check
  // on every navigation instead, so "not logged in anymore" is caught at the
  // moment the user tries to go anywhere, not only when data happens to load.
  useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false;
      return;
    }
    if (hasChecked) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (hasChecked && !user) {
      router.replace("/login");
    }
  }, [hasChecked, user, router]);

  if (!hasChecked) {
    return null;
  }

  if (!user) {
    // Redirect is in flight — render nothing rather than a flash of the
    // authenticated shell.
    return null;
  }

  return (
    <>
      <Sidebar />
      <Header />
      {/* Header floats fixed with a translucent blurred background, so
          main intentionally starts at the same top edge — scrolled
          content shows faintly through the header rather than being
          pushed below it. */}
      <main className="ml-63.75 h-screen flex-1 overflow-y-auto">
        {children}
      </main>
    </>
  );
}
