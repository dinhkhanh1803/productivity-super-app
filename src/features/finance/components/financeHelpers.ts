import { format, subMonths } from "date-fns";
import type { Transaction } from "@/types";

export const incomeColor = "#10b981";
export const expenseColor = "#ef4444";

export function getRecentMonthKeys(selectedMonth: string, count = 6) {
  const anchor = new Date(`${selectedMonth}-01T00:00:00`);
  return Array.from({ length: count }, (_, index) =>
    format(subMonths(anchor, count - index - 1), "yyyy-MM")
  );
}

export function displayCategory(category: string) {
  return category.replace(/-/g, " ");
}

export function translateCategory(category: string, t: (key: string) => string) {
  const key = `finance.category${category.replace(/\s+/g, "")}`;
  const translated = t(key);
  return translated === key ? displayCategory(category) : translated;
}

export function getDayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function summarizeTransactions(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") acc.income += transaction.amount;
      if (transaction.type === "expense") acc.expense += transaction.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

export function getMonthTransactions(transactions: Transaction[], monthKey: string) {
  return transactions.filter((transaction) => transaction.date.startsWith(monthKey));
}

export function getMonthlyTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") acc.totalIncome += transaction.amount;
      if (transaction.type === "expense") acc.totalExpense += transaction.amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );
}
