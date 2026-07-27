"use client";

// src/components/layoutComponents/AppShell.tsx
//
// Splits the app into a public shell (auth pages — no Sidebar/Header, no
// authenticated polling) and a protected shell (everything else — requires
// a real session, redirects to /login otherwise).

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { NotificationsSummaryProvider } from "@/src/hooks/useNotificationsSummary";
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
  const { hasChecked, user } = useCurrentUser();
  const router = useRouter();

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
    <NotificationsSummaryProvider>
      <Sidebar />
      <Header />
      {/* Header floats fixed with a translucent blurred background, so
          main intentionally starts at the same top edge — scrolled
          content shows faintly through the header rather than being
          pushed below it. */}
      <main className="ml-63.75 h-screen flex-1 overflow-y-auto">
        {children}
      </main>
    </NotificationsSummaryProvider>
  );
}
