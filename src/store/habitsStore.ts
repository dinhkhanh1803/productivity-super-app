import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Habit, HabitLog } from "@/types";
import { isSameDay, parseISO } from "date-fns";

interface HabitsState {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "updatedAt" | "streak">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (habitId: string, date: string, completed: boolean) => void;
  calculateStreak: (habitId: string) => number;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [
        {
          id: "1",
          name: "Drink water",
          icon: "💧",
          frequency: "daily",
          reminderTime: "08:00",
          color: "blue",
          streak: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Exercise",
          icon: "🏋️",
          frequency: "daily",
          reminderTime: "18:00",
          color: "orange",
          streak: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      logs: [],

      addHabit: (newHabit) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...newHabit,
              id: Math.random().toString(36).slice(2),
              streak: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, ...updates, updatedAt: new Date().toISOString() }
              : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          logs: state.logs.filter((l) => l.habitId !== id),
        })),

      logHabit: (habitId, date, completed) => {
        set((state) => {
          const newLogs = state.logs.filter(
            (l) => l.habitId !== habitId || !isSameDay(parseISO(l.date), parseISO(date))
          );
          if (completed) {
            newLogs.push({
              id: Math.random().toString(36).slice(2),
              habitId,
              date,
              completed,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          return { logs: newLogs };
        });
        
        // Update streak
        const newStreak = get().calculateStreak(habitId);
        get().updateHabit(habitId, { streak: newStreak });
      },

      calculateStreak: (habitId) => {
        const habitLogs = get().logs
          .filter((l) => l.habitId === habitId && l.completed)
          .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
          
        if (habitLogs.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        // Adjust to today's start
        currentDate.setHours(0, 0, 0, 0);
        
        for (const log of habitLogs) {
          const logDate = parseISO(log.date);
          logDate.setHours(0, 0, 0, 0);
          
          const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = logDate;
          } else {
            break;
          }
        }
        return streak;
      },
    }),
    {
      name: "psa-habits",
    }
  )
);
