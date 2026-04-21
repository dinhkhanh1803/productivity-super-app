import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { MonthlyData, SavingGoal, Transaction, TransactionCategory } from "@/types";

type TransactionInput = Omit<Transaction, "id" | "createdAt" | "updatedAt">;
type GoalInput = Omit<SavingGoal, "id" | "createdAt" | "updatedAt" | "progress">;

interface FinanceState {
  selectedMonth: string;
  monthlyData: Record<string, MonthlyData>;
  transactions: Transaction[];
  categories: TransactionCategory[];
  incomeCategories: TransactionCategory[];
  expenseCategories: TransactionCategory[];
  goals: Record<string, SavingGoal[]>;
  budget: Record<string, number>;

  addTransaction: (transaction: TransactionInput) => void;
  removeTransaction: (id: string) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (monthKey: string, amount: number) => void;
  addCategory: (category: string, type?: "income" | "expense") => void;
  addGoal: (goal: GoalInput, monthKey?: string) => void;
  updateGoalProgress: (id: string, currentAmount: number, monthKey?: string) => void;
  setSelectedMonth: (monthKey: string) => void;

  getMonthlyData: (monthKey?: string) => MonthlyData;
  getTransactionsByMonth: (monthKey: string) => Transaction[];
  getTotalIncome: (monthKey?: string) => number;
  getTotalExpense: (monthKey?: string) => number;
  getBalance: (monthKey?: string) => number;
  getGoalsByMonth: (monthKey?: string) => SavingGoal[];
}

const now = () => new Date().toISOString();
const currentMonth = () => new Date().toISOString().slice(0, 7);
const monthKeyFromDate = (date: string) => new Date(date).toISOString().slice(0, 7);
const defaultExpenseCategories = ["Food", "Transport", "Study", "Entertainment"];
const defaultIncomeCategories = ["Salary", "Freelance", "Bonus", "Investment", "Other income"];
const defaultCategories = [...defaultExpenseCategories, ...defaultIncomeCategories];

function emptyMonthlyData(monthKey: string): MonthlyData {
  const [year, month] = monthKey.split("-").map(Number);
  return {
    month,
    year,
    totalIncome: 0,
    totalExpense: 0,
    budget: 0,
    transactions: [],
  };
}

function calculateMonthlyData(monthKey: string, transactions: Transaction[], budget = 0): MonthlyData {
  const monthTransactions = transactions.filter((transaction) =>
    transaction.date.startsWith(monthKey)
  );

  return {
    ...emptyMonthlyData(monthKey),
    budget,
    totalIncome: monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0),
    totalExpense: monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0),
    transactions: monthTransactions,
  };
}

function buildMonthlyData(
  transactions: Transaction[],
  budget: Record<string, number>
): Record<string, MonthlyData> {
  const keys = new Set([currentMonth(), ...transactions.map((transaction) => monthKeyFromDate(transaction.date))]);

  return Array.from(keys).reduce<Record<string, MonthlyData>>((acc, monthKey) => {
    acc[monthKey] = calculateMonthlyData(monthKey, transactions, budget[monthKey] ?? 0);
    return acc;
  }, {});
}

const seedTransactions: Transaction[] = [
  {
    id: generateId(),
    amount: 5500,
    type: "income",
    category: "Salary",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    note: "Monthly salary",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    amount: 120,
    type: "expense",
    category: "Food",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    note: "Grocery shopping",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    amount: 64,
    type: "expense",
    category: "Transport",
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    note: "Transit pass",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    amount: 240,
    type: "expense",
    category: "Study",
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    note: "Online course",
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: generateId(),
    amount: 82,
    type: "expense",
    category: "Entertainment",
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    note: "Dinner and movie",
    createdAt: now(),
    updatedAt: now(),
  },
];

const initialBudget: Record<string, number> = { [currentMonth()]: 2200 };
const initialMonthlyData = buildMonthlyData(seedTransactions, initialBudget);

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      selectedMonth: currentMonth(),
      monthlyData: initialMonthlyData,
      transactions: seedTransactions,
      categories: defaultCategories,
      incomeCategories: defaultIncomeCategories,
      expenseCategories: defaultExpenseCategories,
      goals: {
        [currentMonth()]: [
          {
            id: generateId(),
            title: "Emergency fund",
            targetAmount: 5000,
            currentAmount: 1800,
            progress: 36,
            createdAt: now(),
            updatedAt: now(),
          },
          {
            id: generateId(),
            title: "New laptop",
            targetAmount: 1800,
            currentAmount: 720,
            progress: 40,
            createdAt: now(),
            updatedAt: now(),
          },
        ],
      },
      budget: initialBudget,

      addTransaction: (transaction) =>
        set((state) => {
          const created: Transaction = {
            ...transaction,
            id: generateId(),
            createdAt: now(),
            updatedAt: now(),
          };
          const transactions = [created, ...state.transactions];
          const targetCategoryKey =
            created.type === "income" ? "incomeCategories" : "expenseCategories";
          const typeCategories = state[targetCategoryKey].includes(created.category)
            ? state[targetCategoryKey]
            : [...state[targetCategoryKey], created.category];
          const categories = state.categories.includes(created.category)
            ? state.categories
            : [...state.categories, created.category];

          return {
            transactions,
            categories,
            [targetCategoryKey]: typeCategories,
            monthlyData: buildMonthlyData(transactions, state.budget),
          };
        }),

      removeTransaction: (id) =>
        set((state) => {
          const transactions = state.transactions.filter((transaction) => transaction.id !== id);
          return {
            transactions,
            monthlyData: buildMonthlyData(transactions, state.budget),
          };
        }),

      deleteTransaction: (id) => get().removeTransaction(id),

      setBudget: (monthKey, amount) =>
        set((state) => {
          const budget = { ...state.budget, [monthKey]: amount };
          return {
            budget,
            monthlyData: buildMonthlyData(state.transactions, budget),
          };
        }),

      addCategory: (category, type) =>
        set((state) => {
          const normalized = category.trim();
          if (!normalized) return state;
          const targetCategoryKey =
            type === "income" ? "incomeCategories" : "expenseCategories";
          const categories = state.categories.includes(normalized)
            ? state.categories
            : [...state.categories, normalized];

          return {
            categories,
            [targetCategoryKey]: state[targetCategoryKey].includes(normalized)
              ? state[targetCategoryKey]
              : [...state[targetCategoryKey], normalized],
          };
        }),

      addGoal: (goal, monthKey) =>
        set((state) => {
          const targetMonth = monthKey ?? state.selectedMonth;
          const currentAmount = Math.max(0, goal.currentAmount);
          const targetAmount = Math.max(0, goal.targetAmount);
          const created: SavingGoal = {
            ...goal,
            currentAmount,
            targetAmount,
            progress: targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0,
            id: generateId(),
            createdAt: now(),
            updatedAt: now(),
          };

          return {
            goals: {
              ...state.goals,
              [targetMonth]: [created, ...(state.goals[targetMonth] ?? [])],
            },
          };
        }),

      updateGoalProgress: (id, currentAmount, monthKey) =>
        set((state) => {
          const targetMonth = monthKey ?? state.selectedMonth;
          return {
            goals: {
              ...state.goals,
              [targetMonth]: (state.goals[targetMonth] ?? []).map((goal) =>
                goal.id === id
                  ? {
                      ...goal,
                      currentAmount,
                      progress:
                        goal.targetAmount > 0
                          ? Math.min(100, Math.round((Math.max(0, currentAmount) / goal.targetAmount) * 100))
                          : 0,
                      updatedAt: now(),
                    }
                  : goal
              ),
            },
          };
        }),

      setSelectedMonth: (monthKey) =>
        set((state) => ({
          selectedMonth: monthKey,
          monthlyData: {
            ...state.monthlyData,
            [monthKey]:
              state.monthlyData[monthKey] ??
              calculateMonthlyData(monthKey, state.transactions, state.budget[monthKey] ?? 0),
          },
        })),

      getMonthlyData: (monthKey) => {
        const targetMonth = monthKey ?? get().selectedMonth;
        return (
          get().monthlyData[targetMonth] ??
          calculateMonthlyData(targetMonth, get().transactions, get().budget[targetMonth] ?? 0)
        );
      },

      getTransactionsByMonth: (monthKey) => get().getMonthlyData(monthKey).transactions,
      getTotalIncome: (monthKey) => get().getMonthlyData(monthKey).totalIncome,
      getTotalExpense: (monthKey) => get().getMonthlyData(monthKey).totalExpense,
      getBalance: (monthKey) => get().getTotalIncome(monthKey) - get().getTotalExpense(monthKey),
      getGoalsByMonth: (monthKey) => get().goals[monthKey ?? get().selectedMonth] ?? [],
    }),
    {
      name: "psa-finance",
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<FinanceState> | undefined;
        const transactions = state?.transactions ?? seedTransactions;
        const budget = state?.budget ?? initialBudget;
        const categories = Array.from(
          new Set([...(state?.categories ?? []), ...defaultCategories, ...transactions.map((transaction) => transaction.category)])
        );

        return {
          ...state,
          selectedMonth: state?.selectedMonth ?? currentMonth(),
          transactions,
          categories,
          incomeCategories: state?.incomeCategories ?? defaultIncomeCategories,
          expenseCategories: state?.expenseCategories ?? defaultExpenseCategories,
          goals: state?.goals ?? {},
          budget,
          monthlyData: buildMonthlyData(transactions, budget),
        };
      },
    }
  )
);
