"use client";

import { useMemo, useState } from "react";
import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinanceStore } from "@/store/financeStore";
import type { Transaction } from "@/types";
import { useT } from "@/hooks/useT";
import { getDayKey, getMonthTransactions, summarizeTransactions, translateCategory } from "./financeHelpers";
import { useCurrencyFormatter } from "./useCurrencyFormatter";

interface FinanceCalendarViewProps {
  monthKey: string;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function FinanceCalendarView({ monthKey }: FinanceCalendarViewProps) {
  const allTransactions = useFinanceStore((state) => state.transactions);
  const { t, lang } = useT();
  const { money } = useCurrencyFormatter();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = useMemo(() => {
    const start = startOfMonth(new Date(`${monthKey}-01T00:00:00`));
    const end = endOfMonth(start);
    const blanks = Array.from({ length: getDay(start) }, () => null);
    return [...blanks, ...eachDayOfInterval({ start, end })];
  }, [monthKey]);

  const transactionsByDay = useMemo(
    () =>
      getMonthTransactions(allTransactions, monthKey).reduce<Record<string, Transaction[]>>((acc, transaction) => {
        const key = transaction.date.slice(0, 10);
        acc[key] ??= [];
        acc[key].push(transaction);
        return acc;
      }, {}),
    [allTransactions, monthKey]
  );

  const activeDay = selectedDay ?? getDayKey(new Date(`${monthKey}-01T00:00:00`));
  const activeTransactions = transactionsByDay[activeDay] ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>
            {lang === "vi"
              ? `Tháng ${Number(monthKey.slice(5))}/${monthKey.slice(0, 4)}`
              : format(new Date(`${monthKey}-01T00:00:00`), "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div key={day} className="py-2 text-center text-xs font-semibold text-[var(--muted-foreground)]">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (!day) return <div key={`blank-${index}`} className="min-h-28" />;
              const key = getDayKey(day);
              const totals = summarizeTransactions(transactionsByDay[key] ?? []);
              const isSelected = activeDay === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(key)}
                  className={`min-h-28 rounded-2xl border p-3 text-left transition-colors hover:bg-[var(--muted)] ${
                    isSelected ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"
                  }`}
                >
                  <span className="text-sm font-semibold">{format(day, "d")}</span>
                  <div className="mt-3 space-y-1">
                    {totals.income > 0 && (
                      <p className="truncate text-xs font-semibold text-emerald-500">
                        +{money(totals.income)}
                      </p>
                    )}
                    {totals.expense > 0 && (
                      <p className="truncate text-xs font-semibold text-red-500">
                        -{money(totals.expense)}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>{format(new Date(`${activeDay}T00:00:00`), "MMM d")} {t("finance.transactions")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeTransactions.length ? (
            activeTransactions.map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Badge variant={transaction.type === "income" ? "success" : "destructive"}>
                    {translateCategory(transaction.category, t)}
                  </Badge>
                  <span className={`font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {money(transaction.amount)}
                  </span>
                </div>
                {transaction.note && <p className="text-sm text-[var(--muted-foreground)]">{transaction.note}</p>}
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">{t("finance.noTransactionsOnDay")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
