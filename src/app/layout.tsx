import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { RouteLoadingProvider } from "@/components/providers/RouteLoadingProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileMenuToggle } from "@/components/layout/MobileMenuToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Productivity Super App",
    template: "%s | Productivity Super App",
  },
  description:
    "Your all-in-one productivity hub — manage todos, finances, calendar, focus sessions, and notes.",
  keywords: ["productivity", "todo", "finance", "calendar", "pomodoro", "notes"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <RouteLoadingProvider>
            <div className="flex h-full">
              {/* Sidebar — fixed left */}
              <Sidebar />

              {/* Main content — fills remaining space */}
              <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                {/* Mobile top bar (hamburger only — no full header) */}
                <MobileMenuToggle />

                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          </RouteLoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
