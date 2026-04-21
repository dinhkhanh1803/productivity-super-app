"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Bell, User, Palette, Languages, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import { useI18nStore } from "@/store/i18nStore";
import { useT } from "@/hooks/useT";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n/translations";
import type { CurrencyCode } from "@/store/i18nStore";

export default function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const { lang, setLang, currency, setCurrency } = useI18nStore();
  const { t } = useT();

  const CARD_DELAY = 0.07;

  return (
    <div className="min-h-full px-5 py-6 sm:px-8 sm:py-8 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold">{t("settings.title")}</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* ── Account ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/12">
                <User className="h-3.5 w-3.5 text-[var(--primary)]" />
              </div>
              <CardTitle className="text-sm">{t("settings.account")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xl font-bold shadow">
                JD
              </div>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-[var(--muted-foreground)]">john@example.com</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              {t("settings.editProfile")}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Language ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARD_DELAY }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/12">
                <Languages className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <CardTitle className="text-sm">{t("settings.language")}</CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs">
              {t("settings.languageDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "en" as Language, label: t("settings.english"), flag: "🇺🇸" },
                  { value: "vi" as Language, label: t("settings.vietnamese"), flag: "🇻🇳" },
                ] as { value: Language; label: string; flag: string }[]
              ).map(({ value, label, flag }) => (
                <button
                  key={value}
                  id={`lang-${value}`}
                  onClick={() => setLang(value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 transition-all text-left",
                    lang === value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]/40 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  <span className="text-2xl">{flag}</span>
                  <div>
                    <p className="text-sm font-semibold leading-none">{label}</p>
                    <p className="text-[10px] uppercase tracking-wider mt-0.5 opacity-70">
                      {value}
                    </p>
                  </div>
                  {lang === value && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[var(--primary)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Current language indicator */}
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--muted)] px-3 py-2">
              <span className="text-sm">{lang === "vi" ? "🇻🇳" : "🇺🇸"}</span>
              <p className="text-xs text-[var(--muted-foreground)]">
                {lang === "vi" ? "Đang sử dụng Tiếng Việt" : "Currently using English"}
              </p>
              <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currency */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARD_DELAY * 1.5 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/12">
                <Coins className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <CardTitle className="text-sm">{t("settings.currency")}</CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs">
              {t("settings.currencyDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  { value: "VND" as CurrencyCode, label: "VNĐ" },
                  { value: "USD" as CurrencyCode, label: "USD" },
                  { value: "EUR" as CurrencyCode, label: "EUR" },
                  { value: "JPY" as CurrencyCode, label: "JPY" },
                ] as { value: CurrencyCode; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  id={`currency-${value}`}
                  onClick={() => setCurrency(value)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 transition-all text-left",
                    currency === value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
                  )}
                >
                  <span className="text-sm font-semibold">{label}</span>
                  {currency === value && (
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-[var(--muted)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
              {t("settings.currentCurrency")}:{" "}
              <span className="font-semibold text-[var(--foreground)]">{currency}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Appearance ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARD_DELAY * 2 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/12">
                <Palette className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <CardTitle className="text-sm">{t("settings.appearance")}</CardTitle>
            </div>
            <CardDescription className="mt-1 text-xs">
              {t("settings.themeDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "light" as const, label: t("settings.light"), icon: Sun },
                { value: "dark" as const,  label: t("settings.dark"),  icon: Moon },
                { value: "system" as const, label: t("settings.system"), icon: Monitor },
              ] as { value: "light" | "dark" | "system"; label: string; icon: React.ElementType }[]).map(
                ({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    id={`theme-${value}`}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all",
                      theme === value
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Notifications ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARD_DELAY * 3 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/12">
                <Bell className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <CardTitle className="text-sm">{t("settings.notifications")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: "taskReminders",   descKey: "taskRemindersDesc" },
              { key: "focusComplete",   descKey: "focusCompleteDesc" },
              { key: "dailySummary",    descKey: "dailySummaryDesc" },
            ].map(({ key, descKey }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl py-1"
              >
                <div>
                  <p className="text-sm font-medium">{t(`settings.${key}`)}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {t(`settings.${descKey}`)}
                  </p>
                </div>
                {/* Toggle pill */}
                <div className="relative ml-4 h-5 w-9 cursor-pointer rounded-full bg-[var(--primary)] shrink-0">
                  <span className="absolute left-4 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── About ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARD_DELAY * 4 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="py-4 text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Productivity Super App{" "}
              <span className="font-semibold text-[var(--foreground)]">v1.0.0</span>
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {t("common.builtWith")}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
