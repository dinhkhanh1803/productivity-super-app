"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Target, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFinanceStore } from "@/store/financeStore";
import { useT } from "@/hooks/useT";
import { getMonthlyTotals, getMonthTransactions } from "./financeHelpers";
import { useCurrencyFormatter } from "./useCurrencyFormatter";

interface FinanceSummaryProps {
  monthKey: string;
}

export function FinanceSummary({ monthKey }: FinanceSummaryProps) {
  const transactions = useFinanceStore((state) => state.transactions);
  const monthlyBudget = useFinanceStore((state) => state.budget[monthKey] ?? 0);
  const { t } = useT();
  const { money, currency } = useCurrencyFormatter();
  const monthlyTransactions = useMemo(
    () => getMonthTransactions(transactions, monthKey),
    [monthKey, transactions]
  );
  const monthlyTotals = useMemo(() => getMonthlyTotals(monthlyTransactions), [monthlyTransactions]);
  const balance = monthlyTotals.totalIncome - monthlyTotals.totalExpense;
  const [open, setOpen] = useState(false);
  const [budget, setBudgetInput] = useState(String(monthlyBudget || ""));
  const setBudget = useFinanceStore((state) => state.setBudget);
  const budgetProgress =
    monthlyBudget > 0 ? Math.min(100, Math.round((monthlyTotals.totalExpense / monthlyBudget) * 100)) : 0;

  const cards = [
    {
      label: t("finance.currentBalance"),
      value: money(balance),
      icon: Wallet,
      className: balance >= 0 ? "text-emerald-500" : "text-red-500",
      bg: balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
    {
      label: t("finance.totalIncome"),
      value: money(monthlyTotals.totalIncome),
      icon: ArrowUpRight,
      className: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: t("finance.totalExpense"),
      value: money(monthlyTotals.totalExpense),
      icon: ArrowDownRight,
      className: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="rounded-2xl shadow-md">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--muted-foreground)]">{card.label}</p>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.className}`} />
                  </div>
                </div>
                <p className={`text-3xl font-bold tabular-nums ${card.className}`}>{card.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
                <Target className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="font-semibold">{t("finance.monthlyBudget")}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {money(monthlyTotals.totalExpense)} {t("finance.spent")}
                  {monthlyBudget > 0 ? ` ${t("finance.of")} ${money(monthlyBudget)}` : ""}
                </p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(true)}>
              {t("finance.setBudget")}
            </Button>
          </div>
          <Progress
            value={budgetProgress}
            className="h-3"
            indicatorClassName={budgetProgress >= 90 ? "bg-red-500" : "bg-emerald-500"}
          />
          <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>{budgetProgress}% {t("finance.used")}</span>
            <span>{monthlyBudget > 0 ? money(Math.max(monthlyBudget - monthlyTotals.totalExpense, 0)) : money(0)} {t("finance.left")}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("finance.setMonthlyBudget")}</DialogTitle>
            <DialogDescription>
              {t("finance.budgetDescription")}
            </DialogDescription>
          </DialogHeader>
          <Input
            label={t("finance.budget")}
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(event) => setBudgetInput(event.target.value)}
            leftIcon={<span className="text-xs font-bold">{currency}</span>}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("finance.cancel")}
            </Button>
            <Button
              onClick={() => {
                setBudget(monthKey, Math.max(0, Number(budget) || 0));
                setOpen(false);
              }}
            >
              {t("finance.saveBudget")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
