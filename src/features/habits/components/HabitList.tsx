"use client";

import { useHabitsStore } from "@/store/habitsStore";
import { HabitCard } from "./HabitCard";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, ListFilter, LayoutGrid } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { HabitForm } from "./HabitForm";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export function HabitList() {
  const { habits, logs } = useHabitsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter(h => 
    logs.some(l => l.habitId === h.id && isSameDay(parseISO(l.date), parseISO(today)) && l.completed)
  ).length;

  const progress = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header Stat Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Today's Progress</h2>
            <p className="text-white/80 font-medium">
              You've completed <span className="text-white font-bold">{completedToday}</span> of <span className="text-white font-bold">{habits.length}</span> habits for today.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
              <span className="text-sm font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-2xl bg-white px-6 font-bold text-[var(--primary)] hover:bg-white/90 shadow-xl transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> New Habit
              </Button>
            </DialogTrigger>
            <HabitForm onSuccess={() => setIsFormOpen(false)} />
          </Dialog>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-bold">Ongoing Habits</h3>
        </div>
        
        <div className="flex items-center gap-2 rounded-xl bg-[var(--card)]/40 p-1 border border-[var(--border)]">
          <Button 
            variant={viewMode === "grid" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "list" ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={() => setViewMode("list")}
          >
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {habits.length > 0 ? (
          <motion.div 
            layout
            className={cn(
              "grid gap-4",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-6 rounded-[2.5rem] bg-[var(--card)]/40 p-10 backdrop-blur-md border border-[var(--border)]">
              <Plus className="h-16 w-16 text-[var(--muted-foreground)] opacity-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No habits yet?</h3>
            <p className="text-[var(--muted-foreground)] max-w-xs mx-auto mb-8">
              Start building better routines today! Add your first habit and track your progress daily.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="rounded-2xl h-11 px-6 shadow-lg shadow-[var(--primary)]/20">
              <Plus className="mr-2 h-4 w-4" /> Create My First Habit
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
