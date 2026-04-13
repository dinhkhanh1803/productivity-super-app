import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { Transaction, Budget, TransactionType, TransactionCategory } from "@/types";

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string; // "YYYY-MM"

  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: TransactionCategory, limit: number) => void;
  setSelectedMonth: (month: string) => void;

  // Computed selectors (not stored)
  getTotalIncome: (month?: string) => number;
  getTotalExpense: (month?: string) => number;
  getBalance: (month?: string) => number;
  getTransactionsByMonth: (month: string) => Transaction[];
}

const now = () => new Date().toISOString();
const currentMonth = () => new Date().toISOString().slice(0, 7);

const seedTransactions: Transaction[] = [
  { id: generateId(), title: "Monthly Salary", amount: 5500, type: "income", category: "salary", date: new Date(Date.now() - 2 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Grocery Shopping", amount: 120, type: "expense", category: "food", date: new Date(Date.now() - 1 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Netflix Subscription", amount: 15.99, type: "expense", category: "entertainment", date: new Date(Date.now() - 3 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Electricity Bill", amount: 85, type: "expense", category: "utilities", date: new Date(Date.now() - 5 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Freelance Payment", amount: 800, type: "income", category: "salary", date: new Date(Date.now() - 7 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Bus Pass", amount: 45, type: "expense", category: "transport", date: new Date(Date.now() - 8 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Gym Membership", amount: 40, type: "expense", category: "health", date: new Date(Date.now() - 10 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
  { id: generateId(), title: "Restaurant Dinner", amount: 65, type: "expense", category: "food", date: new Date(Date.now() - 12 * 86400000).toISOString(), createdAt: now(), updatedAt: now() },
];

const defaultBudgets: Budget[] = [
  { category: "food", limit: 500, spent: 0 },
  { category: "transport", limit: 200, spent: 0 },
  { category: "entertainment", limit: 150, spent: 0 },
  { category: "health", limit: 200, spent: 0 },
  { category: "utilities", limit: 300, spent: 0 },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: seedTransactions,
      budgets: defaultBudgets,
      selectedMonth: currentMonth(),

      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: generateId(), createdAt: now(), updatedAt: now() },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now() } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateBudget: (category, limit) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.category === category ? { ...b, limit } : b
          ),
        })),

      setSelectedMonth: (month) => set({ selectedMonth: month }),

      getTransactionsByMonth: (month) => {
        return get().transactions.filter((t) => t.date.startsWith(month));
      },

      getTotalIncome: (month) => {
        const txns = month
          ? get().getTransactionsByMonth(month)
          : get().transactions;
        return txns
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpense: (month) => {
        const txns = month
          ? get().getTransactionsByMonth(month)
          : get().transactions;
        return txns
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: (month) => {
        return get().getTotalIncome(month) - get().getTotalExpense(month);
      },
    }),
    { name: "psa-finance" }
  )
);
