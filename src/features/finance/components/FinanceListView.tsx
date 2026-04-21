"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore } from "@/store/financeStore";
import { useT } from "@/hooks/useT";
import { useCurrencyFormatter } from "./useCurrencyFormatter";
import { getMonthTransactions, translateCategory } from "./financeHelpers";

interface FinanceListViewProps {
  monthKey: string;
}

export function FinanceListView({ monthKey }: FinanceListViewProps) {
  const allTransactions = useFinanceStore((state) => state.transactions);
  const categories = useFinanceStore((state) => state.categories);
  const removeTransaction = useFinanceStore((state) => state.removeTransaction);
  const { t } = useT();
  const { money } = useCurrencyFormatter();
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");

  const transactions = useMemo(
    () =>
      getMonthTransactions(allTransactions, monthKey).filter((transaction) => {
        const typeMatch = type === "all" || transaction.type === type;
        const categoryMatch = category === "all" || transaction.category === category;
        const dateMatch = !date || transaction.date.startsWith(date);
        return typeMatch && categoryMatch && dateMatch;
      }),
    [allTransactions, category, date, monthKey, type]
  );

  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("finance.allTypes")}</SelectItem>
              <SelectItem value="income">{t("finance.income")}</SelectItem>
              <SelectItem value="expense">{t("finance.expense")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder={t("finance.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("finance.allCategories")}</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {translateCategory(item, t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>

        <div className="divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
          {transactions.length ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="grid gap-3 p-4 transition-colors hover:bg-[var(--muted)] md:grid-cols-[1fr_auto_auto]"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant={transaction.type === "income" ? "success" : "destructive"}>
                      {translateCategory(transaction.category, t)}
                    </Badge>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {format(new Date(transaction.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="truncate text-sm text-[var(--muted-foreground)]">
                    {transaction.note || t("finance.noNote")}
                  </p>
                </div>
                <span
                  className={`self-center text-right font-semibold tabular-nums ${
                    transaction.type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {money(transaction.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="self-center justify-self-end text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                  onClick={() => removeTransaction(transaction.id)}
                  aria-label={t("finance.removeTransaction")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">{t("finance.noTransactionsMatch")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
