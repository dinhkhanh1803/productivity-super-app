import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Goal } from "@/types";

interface GoalsState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalStatus: (id: string) => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [
        {
          id: "1",
          title: "Master Next.js App Router",
          description: "Learn parallel routes, intercepting routes, and server actions.",
          type: "long_term",
          status: "active",
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 65,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Read 2 Books this month",
          description: "Focus on technical and self-improvement books.",
          type: "short_term",
          status: "active",
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],

      addGoal: (newGoal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...newGoal,
              id: Math.random().toString(36).slice(2),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? { ...g, ...updates, updatedAt: new Date().toISOString() }
              : g
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      toggleGoalStatus: (id) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  status: g.status === "active" ? "completed" : "active",
                  progress: g.status === "active" ? 100 : g.progress,
                  updatedAt: new Date().toISOString(),
                }
              : g
          ),
        })),
    }),
    {
      name: "psa-goals",
    }
  )
);
