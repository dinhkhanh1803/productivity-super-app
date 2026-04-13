"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Calendar,
  Timer,
  FileText,
  Settings,
  ChevronLeft,
  Zap,
  LogOut,
  X,
  Bot,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useTodoStore } from "@/store/todoStore";
import { useRealTimeClock } from "@/hooks/useRealTimeClock";
import { useWeather } from "@/hooks/useWeather";
import { useT } from "@/hooks/useT";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

/* ─── Nav item helper ────────────────────────────────────── */
function NavItem({
  href,
  icon: Icon,
  label,
  badge,
  collapsed,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ x: collapsed ? 0 : 3 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 select-none",
          active
            ? "bg-[var(--primary)]/12 text-[var(--primary)]"
            : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? label : undefined}
      >
        {/* Active indicator bar */}
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[var(--primary)]"
          />
        )}

        <Icon
          className={cn(
            "shrink-0",
            active
              ? "text-[var(--primary)]"
              : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
          )}
          style={{ width: 17, height: 17 }}
        />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {badge != null && badge > 0 && !collapsed && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[10px] font-bold px-1 leading-none">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}

/* ─── Weather widget ─────────────────────────────────────── */
function WeatherWidget({ collapsed }: { collapsed: boolean }) {
  const { data, loading, error } = useWeather();
  const { t } = useT();

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-[var(--muted-foreground)]",
          collapsed ? "justify-center py-2" : "px-4 py-2.5"
        )}
      >
        <Wind className="h-3.5 w-3.5 animate-pulse" />
        {!collapsed && (
          <span className="text-xs animate-pulse">{t("weather.loading")}</span>
        )}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-[var(--muted-foreground)]",
          collapsed ? "justify-center py-2" : "px-4 py-2.5"
        )}
      >
        <span className="text-sm">🌡️</span>
        {!collapsed && (
          <span className="text-xs">{t("weather.error")}</span>
        )}
      </div>
    );
  }

  const conditionLabel = t(`weather.conditions.${data.conditionKey}`);

  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center gap-0.5 py-2"
        title={`${data.temp}°C · ${conditionLabel} · ${data.city}`}
      >
        <span className="text-base leading-none">{data.emoji}</span>
        <span className="font-mono text-[10px] font-bold text-[var(--foreground)]">
          {data.temp}°
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{data.emoji}</span>
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)] leading-none">
            {data.temp}°C
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)]">
            {conditionLabel}
          </p>
        </div>
      </div>
      <div className="text-right max-w-[80px]">
        <p className="text-[10px] text-[var(--muted-foreground)] truncate leading-snug">
          {data.city}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Sidebar ───────────────────────────────────────── */
export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed, sidebarOpen, setSidebarOpen } =
    useUIStore();
  const pendingTodos = useTodoStore((s) =>
    s.todos.filter((t) => !t.completed).length
  );
  const clock = useRealTimeClock();
  const { t } = useT();

  const navItems = [
    { label: t("sidebar.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("sidebar.todo"),      href: "/todo",      icon: CheckSquare },
    { label: t("sidebar.finance"),   href: "/finance",   icon: DollarSign },
    { label: t("sidebar.calendar"),  href: "/calendar",  icon: Calendar },
    { label: t("sidebar.focus"),     href: "/focus",     icon: Timer },
    { label: t("sidebar.notes"),     href: "/notes",     icon: FileText },
    { label: t("sidebar.ai"),        href: "/ai",        icon: Bot },
  ];

  const onNavClick = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col overflow-hidden",
          "border-r border-[var(--sidebar-border)] bg-[var(--sidebar)]",
          "shadow-xl lg:shadow-none lg:relative lg:z-auto",
          !sidebarOpen && "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 lg:transition-none"
        )}
        style={{ minWidth: sidebarCollapsed ? 72 : 240 }}
      >
        {/* ── Logo row ──────────────────────────────────── */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="leading-none">
                  <span className="block text-sm font-bold tracking-tight">
                    Productivity
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] font-medium uppercase tracking-widest">
                    Super App
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow"
              >
                <Zap className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)] transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>

          <button
            className={cn(
              "hidden h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)] transition-all duration-200 lg:flex",
              sidebarCollapsed && "rotate-180"
            )}
            onClick={toggleSidebarCollapsed}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* ── Clock + Weather ────────────────────────────── */}
        <div className="shrink-0 border-b border-[var(--sidebar-border)]">
          <AnimatePresence initial={false}>
            {!sidebarCollapsed ? (
              <motion.div
                key="clock-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {/* Clock */}
                <div className="px-4 pt-4 pb-2">
                  <p className="font-mono text-3xl font-bold tabular-nums tracking-tight text-[var(--foreground)] leading-none">
                    {clock.time}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--muted-foreground)]">
                    {clock.dayOfWeek}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {clock.date}
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-4 border-t border-[var(--sidebar-border)]" />

                {/* Weather */}
                <WeatherWidget collapsed={false} />
              </motion.div>
            ) : (
              <motion.div
                key="clock-compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-1 py-3"
              >
                {/* Mini clock */}
                <div
                  className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-[var(--sidebar-accent)]"
                  title={`${clock.dayOfWeek} ${clock.date} ${clock.time}`}
                >
                  <span className="font-mono text-[9px] font-bold leading-none tabular-nums text-[var(--foreground)]">
                    {clock.time.slice(0, 5)}
                  </span>
                </div>
                {/* Mini weather */}
                <WeatherWidget collapsed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (pathname === "/" && item.href === "/dashboard");
            return (
              <NavItem
                key={item.href}
                {...item}
                badge={item.href === "/todo" ? pendingTodos : undefined}
                collapsed={sidebarCollapsed}
                active={active}
                onClick={onNavClick}
              />
            );
          })}
        </nav>

        {/* ── Bottom section ────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3 space-y-0.5">
          {/* User */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors hover:bg-[var(--sidebar-accent)]",
              sidebarCollapsed && "justify-center px-2"
            )}
            title={sidebarCollapsed ? "John Doe" : undefined}
          >
            <AvatarPrimitive.Root className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--primary)]/25">
              <AvatarPrimitive.Image src="" alt="User" />
              <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white text-[10px] font-bold">
                JD
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)] leading-none">
                    John Doe
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                    john@example.com
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <NavItem
            href="/settings"
            icon={Settings}
            label={t("sidebar.settings")}
            collapsed={sidebarCollapsed}
            active={pathname === "/settings"}
            onClick={onNavClick}
          />

          {/* Sign out */}
          <motion.div
            whileHover={{ x: sidebarCollapsed ? 0 : 3 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-500",
              sidebarCollapsed && "justify-center px-2"
            )}
            title={sidebarCollapsed ? t("sidebar.signOut") : undefined}
          >
            <LogOut style={{ width: 17, height: 17 }} className="shrink-0" />
            <AnimatePresence initial={false}>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {t("sidebar.signOut")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
