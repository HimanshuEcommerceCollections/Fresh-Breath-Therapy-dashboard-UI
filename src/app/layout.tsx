import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/src/components/layoutComponents/Sidebar/Sidebar";
import Header from "@/src/components/layoutComponents/Header/Header";
import ToastViewport from "@/src/components/sharedComponents/ToastViewport";
import { NotificationsSummaryProvider } from "@/src/hooks/useNotificationsSummary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The design spec calls for Inter across the whole dashboard (header, stat
// cards, charts) — applied at body level so it cascades everywhere except
// the sidebar, which already sets its own scoped Inter instance.
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fresh Breath Therapy",
  description: "Fresh Breath Therapy internal dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${inter.className} flex min-h-full`}>
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
          <ToastViewport />
        </NotificationsSummaryProvider>
      </body>
    </html>
  );
}
