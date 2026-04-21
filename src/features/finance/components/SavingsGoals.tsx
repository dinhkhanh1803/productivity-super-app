"use client";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { SavingGoal } from "@/types";
import { useT } from "@/hooks/useT";
import { useCurrencyFormatter } from "./useCurrencyFormatter";

interface SavingsGoalsProps {
  monthKey: string;
}

const emptyGoals: SavingGoal[] = [];

export function SavingsGoals({ monthKey }: SavingsGoalsProps) {
  const goals = useFinanceStore((state) => state.goals[monthKey] ?? emptyGoals);
  const addGoal = useFinanceStore((state) => state.addGoal);
  const updateGoalProgress = useFinanceStore((state) => state.updateGoalProgress);
  const { t } = useT();
  const { money } = useCurrencyFormatter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", targetAmount: "", currentAmount: "" });

  function save() {
    const targetAmount = Number(form.targetAmount);
    if (!form.title.trim() || targetAmount <= 0) return;
    addGoal(
      {
        title: form.title.trim(),
        targetAmount,
        currentAmount: Math.max(0, Number(form.currentAmount) || 0),
      },
      monthKey
    );
    setForm({ title: "", targetAmount: "", currentAmount: "" });
    setOpen(false);
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{t("finance.savingsGoals")}</CardTitle>
        <Button size="sm" className="rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("finance.addGoal")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length ? (
          goals.map((goal) => (
            <div key={goal.id} className="rounded-2xl border border-[var(--border)] p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                    <Target className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold">{goal.title}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {money(goal.currentAmount)} {t("finance.of")} {money(goal.targetAmount)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2.5" indicatorClassName="bg-emerald-500" />
              <Input
                className="mt-3"
                type="number"
                min="0"
                step="0.01"
                value={goal.currentAmount}
                onChange={(event) => updateGoalProgress(goal.id, Number(event.target.value) || 0, monthKey)}
              />
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-10 text-center text-sm text-[var(--muted-foreground)]">
            {t("finance.noGoals")}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("finance.addSavingGoal")}</DialogTitle>
            <DialogDescription>
              {t("finance.savingGoalDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label={t("finance.titleField")}
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <Input
              label={t("finance.targetAmount")}
              type="number"
              min="0"
              step="0.01"
              value={form.targetAmount}
              onChange={(event) => setForm((current) => ({ ...current, targetAmount: event.target.value }))}
            />
            <Input
              label={t("finance.currentAmount")}
              type="number"
              min="0"
              step="0.01"
              value={form.currentAmount}
              onChange={(event) => setForm((current) => ({ ...current, currentAmount: event.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("finance.cancel")}
            </Button>
            <Button onClick={save}>{t("finance.addGoal")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
