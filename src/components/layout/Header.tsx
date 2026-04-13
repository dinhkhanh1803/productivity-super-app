"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Check,
  Trash2,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/todo": "Todo",
  "/finance": "Finance",
  "/calendar": "Calendar",
  "/focus": "Focus",
  "/notes": "Notes",
  "/settings": "Settings",
};

const typeColors = {
  info: "bg-[var(--primary)]/15 text-[var(--primary)]",
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  error: "bg-red-500/15 text-red-500",
};

export function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Productivity Super App";

  const { toggleSidebar, notifications, markNotificationRead, clearNotifications, theme, setTheme } =
    useUIStore();

  const unread = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        id="mobile-menu-toggle"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-[var(--foreground)] hidden sm:block">
        {title}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:block w-64">
        <Input
          placeholder="Search..."
          leftIcon={<Search className="h-4 w-4" />}
          className="h-8 bg-[var(--muted)] border-transparent focus-visible:bg-[var(--card)]"
          id="header-search"
        />
      </div>

      {/* Theme toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" id="theme-toggle">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(["light", "dark", "system"] as const).map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t)}
              className="gap-2 capitalize"
            >
              {t === "light" ? <Sun className="h-4 w-4" /> : t === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              {t}
              {theme === t && <Check className="ml-auto h-4 w-4 text-[var(--primary)]" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" id="notifications-trigger">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse-glow" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between px-2 py-1.5">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-[var(--muted-foreground)] gap-1"
                onClick={clearNotifications}
              >
                <Trash2 className="h-3 w-3" /> Clear all
              </Button>
            )}
          </div>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--muted-foreground)]">
              No notifications
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-3 py-2.5 cursor-pointer hover:bg-[var(--accent)] rounded-md transition-colors",
                    !n.read && "bg-[var(--primary)]/5"
                  )}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                      typeColors[n.type]
                    )}
                  >
                    {n.type === "success" ? "✓" : n.type === "warning" ? "!" : "i"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                      {formatRelativeDate(n.timestamp)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="mt-2 h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" id="user-menu-trigger">
            <AvatarPrimitive.Root className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-[var(--border)] ring-offset-1 ring-offset-[var(--background)]">
              <AvatarPrimitive.Image src="" alt="User" />
              <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white text-xs font-bold">
                JD
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>
            <div>
              <p className="font-semibold text-sm">John Doe</p>
              <p className="text-xs text-[var(--muted-foreground)] font-normal">john@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <User className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2" destructive>
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
