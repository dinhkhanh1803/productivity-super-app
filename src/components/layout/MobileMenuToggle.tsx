"use client";

import { Menu } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/todo": "Todo",
  "/finance": "Finance",
  "/calendar": "Calendar",
  "/focus": "Focus",
  "/notes": "Notes",
  "/settings": "Settings",
};

/**
 * A minimal mobile-only bar that shows the page title
 * and a burger button to open the sidebar.
 * Hidden on lg+ (sidebar is always visible on desktop).
 */
export function MobileMenuToggle() {
  const { setSidebarOpen } = useUIStore();
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Productivity";

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--background)] px-4 lg:hidden">
      <button
        id="mobile-menu-btn"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-[var(--foreground)]">{title}</span>
    </div>
  );
}
