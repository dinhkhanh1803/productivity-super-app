"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckSquare,
  Circle,
  CheckCircle2,
  Timer,
  Play,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3D } from "@/components/ui/card-3d";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTodoStore } from "@/store/todoStore";
import { useFinanceStore } from "@/store/financeStore";
import { useFocusStore } from "@/store/focusStore";
import { useT } from "@/hooks/useT";
import { formatCurrency, getCurrencyLocale } from "@/lib/utils";
import { useI18nStore } from "@/store/i18nStore";
import { GoalsWidget } from "./GoalsWidget";
import { HabitsWidget } from "./HabitsWidget";

/* ─── Today Tasks card ──────────────────────────────────── */
function TodayTasksCard() {
  const todos = useTodoStore((s) => s.todos);
  const { t } = useT();
  const recent = todos.slice(0, 4);
  const done = todos.filter((t) => t.completed).length;
  const pct = todos.length ? Math.round((done / todos.length) * 100) : 0;

  return (
    <Card3D>
      <Card className="h-full rounded-2xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/15">
                <CheckSquare className="h-3.5 w-3.5 text-[var(--primary)]" />
              </div>
              <CardTitle className="text-sm">{t("dashboard.todayTasks")}</CardTitle>
            </div>
            <Link href="/todo">
              <Button variant="ghost" size="icon-sm" className="text-[var(--muted-foreground)]">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1.5">
              <span>
                {done} {t("dashboard.doneOf")} {todos.length}
              </span>
              <span className="font-semibold text-[var(--foreground)]">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
          <div className="space-y-1">
            {recent.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--muted)] transition-colors"
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                )}
                <span
                  className={`text-xs truncate ${
                    todo.completed
                      ? "line-through text-[var(--muted-foreground)]"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Card3D>
  );
}

/* ─── Start Studying card ───────────────────────────────── */
function StartStudyingCard() {
  const { currentMode, timeLeft, isRunning, settings } = useFocusStore();
  const { t } = useT();
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Card3D>
      <Card className="relative h-full rounded-2xl shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/8 via-transparent to-[var(--accent)]/8 pointer-events-none" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15">
              <Timer className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <CardTitle className="text-sm">{t("dashboard.startStudying")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-2">
          <div className="flex flex-col items-center">
            <span className="font-mono text-4xl font-bold tabular-nums text-[var(--foreground)]">
              {pad(m)}:{pad(s)}
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)] capitalize">
              {currentMode.replace("_", " ")} &middot; {settings.focusDuration}m {t("dashboard.session")}
            </span>
          </div>
          <Link href="/focus" className="w-full">
            <Button className="w-full gap-2 rounded-xl shadow" size="sm">
              <Play className="h-4 w-4" />
              {isRunning ? t("dashboard.resumeFocus") : t("dashboard.startFocusMode")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Card3D>
  );
}

/* ─── Finance card ──────────────────────────────────────── */
function FinanceCard() {
  const { getTotalIncome, getTotalExpense } = useFinanceStore();
  const currency = useI18nStore((s) => s.currency);
  const { t } = useT();
  const month = new Date().toISOString().slice(0, 7);
  const income = getTotalIncome(month);
  const expense = getTotalExpense(month);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  const bars = [65, 48, 72, 40, 88, 55, 70];

  return (
    <Card3D>
      <Card className="h-full rounded-2xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
                <Wallet className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <CardTitle className="text-sm">{t("dashboard.finance")}</CardTitle>
            </div>
            <Link href="/finance">
              <Button variant="ghost" size="icon-sm" className="text-[var(--muted-foreground)]">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">{t("dashboard.monthlyBalance")}</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {formatCurrency(balance, currency, getCurrencyLocale(currency))}
            </p>
          </div>
          <div className="flex items-end gap-1 h-10">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                style={{ height: `${h}%`, originY: "bottom" }}
                className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? "bg-[var(--primary)]" : "bg-[var(--primary)]/25"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{t("finance.income")}</span>
              </div>
              <p className="text-xs font-bold">{formatCurrency(income, currency, getCurrencyLocale(currency))}</p>
            </div>
            <div className="flex-1 rounded-lg bg-red-500/10 px-2.5 py-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span className="text-[10px] text-red-500 font-medium">{t("finance.expense")}</span>
              </div>
              <p className="text-xs font-bold">{formatCurrency(expense, currency, getCurrencyLocale(currency))}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] mb-1">
              <span>{t("dashboard.savingsRate")}</span>
              <span className="font-semibold text-[var(--foreground)]">{Math.max(0, savingsRate)}%</span>
            </div>
            <Progress value={Math.max(0, savingsRate)} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </Card3D>
  );
}

export function QuickActionsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <TodayTasksCard />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
        <GoalsWidget />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <HabitsWidget />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <StartStudyingCard />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
        <FinanceCard />
      </motion.div>
    </div>
  );
}
