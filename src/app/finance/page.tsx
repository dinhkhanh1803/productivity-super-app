"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
} from "lucide-react";
import { format } from "date-fns";
import { useFinanceStore } from "@/store/financeStore";
import type { TransactionType, TransactionCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const categories: TransactionCategory[] = [
  "salary","food","transport","entertainment","health","utilities","housing","savings","other",
];

const categoryColors: Record<TransactionCategory, string> = {
  salary: "bg-emerald-500/15 text-emerald-600",
  food: "bg-orange-500/15 text-orange-600",
  transport: "bg-blue-500/15 text-blue-600",
  entertainment: "bg-purple-500/15 text-purple-600",
  health: "bg-red-500/15 text-red-600",
  utilities: "bg-yellow-500/15 text-yellow-600",
  housing: "bg-cyan-500/15 text-cyan-600",
  savings: "bg-teal-500/15 text-teal-600",
  other: "bg-slate-500/15 text-slate-600",
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

export default function FinancePage() {
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    getTotalIncome,
    getTotalExpense,
    getBalance,
    selectedMonth,
    setSelectedMonth,
    getTransactionsByMonth,
  } = useFinanceStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense" as TransactionType,
    category: "food" as TransactionCategory,
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const income = getTotalIncome(selectedMonth);
  const expense = getTotalExpense(selectedMonth);
  const balance = getBalance(selectedMonth);
  const monthlyTransactions = getTransactionsByMonth(selectedMonth);

  // Expense breakdown
  const expenseByCategory = categories.reduce(
    (acc, cat) => {
      const total = monthlyTransactions
        .filter((t) => t.type === "expense" && t.category === cat)
        .reduce((s, t) => s + t.amount, 0);
      if (total > 0) acc[cat] = total;
      return acc;
    },
    {} as Record<string, number>
  );

  function handleSubmit() {
    if (!form.title || !form.amount) return;
    addTransaction({
      ...form,
      amount: parseFloat(form.amount),
      date: new Date(form.date).toISOString(),
    });
    setIsAddOpen(false);
    setForm({ title: "", amount: "", type: "expense", category: "food", date: new Date().toISOString().split("T")[0], note: "" });
  }

  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Finance</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Track income and expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40 h-9"
            id="finance-month-picker"
          />
          <Button onClick={() => setIsAddOpen(true)} id="add-transaction-btn">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Income",
            value: formatCurrency(income),
            icon: ArrowUpRight,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Expenses",
            value: formatCurrency(expense),
            icon: ArrowDownRight,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
          {
            label: "Balance",
            value: formatCurrency(balance),
            icon: Wallet,
            color: balance >= 0 ? "text-[var(--primary)]" : "text-red-500",
            bg: balance >= 0 ? "bg-[var(--primary)]/10" : "bg-red-500/10",
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} custom={i} variants={fadeUp} initial="hidden" animate="show">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[var(--muted-foreground)] font-medium">{card.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  {card.label === "Balance" && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                        <span>Savings rate</span>
                        <span className="font-medium">{Math.max(0, savingsRate)}%</span>
                      </div>
                      <Progress value={Math.max(0, savingsRate)} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        {/* Transactions tab */}
        <TabsContent value="transactions">
          <Card className="mt-4">
            <CardContent className="p-0">
              {monthlyTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <PiggyBank className="h-10 w-10 text-[var(--muted-foreground)] opacity-40 mb-3" />
                  <p className="text-[var(--muted-foreground)] text-sm">No transactions this month</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {monthlyTransactions.map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--muted)] transition-colors group"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${categoryColors[txn.category]}`}
                      >
                        {txn.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{txn.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)] capitalize">
                          {txn.category} · {format(new Date(txn.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          txn.type === "income" ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {txn.type === "income" ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </span>
                      <Badge variant={txn.type === "income" ? "success" : "destructive"} size="sm">
                        {txn.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                        onClick={() => deleteTransaction(txn.id)}
                        id={`delete-txn-${txn.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown tab */}
        <TabsContent value="breakdown">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(expenseByCategory).length === 0 ? (
                <p className="text-center text-sm text-[var(--muted-foreground)] py-8">
                  No expenses this month
                </p>
              ) : (
                Object.entries(expenseByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => {
                    const pct = expense > 0 ? Math.round((amount / expense) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${categoryColors[cat as TransactionCategory]}`}>
                            {cat}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted-foreground)]">{pct}%</span>
                            <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                          </div>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budgets tab */}
        <TabsContent value="budgets">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Monthly Budgets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((budget) => {
                const spent = expenseByCategory[budget.category] ?? 0;
                const pct = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
                const over = pct > 100;
                return (
                  <div key={budget.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium capitalize">{budget.category}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(pct, 100)}
                      className="h-2"
                      indicatorClassName={over ? "bg-red-500" : undefined}
                    />
                    {over && (
                      <p className="text-xs text-red-500 mt-1">
                        {formatCurrency(spent - budget.limit)} over budget
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Type toggle */}
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              {(["expense", "income"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                >
                  {t}
                </button>
              ))}
            </div>
            <Input
              label="Title"
              placeholder="Transaction name"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              id="txn-title-input"
            />
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              leftIcon={<span className="text-xs font-bold">$</span>}
              id="txn-amount-input"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] capitalize"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TransactionCategory }))}
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              id="txn-date-input"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.title || !form.amount}>
              Add Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
