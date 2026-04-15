"use client";

import { useHabitsStore } from "@/store/habitsStore";
import { useT } from "@/hooks/useT";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3D } from "@/components/ui/card-3d";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function HabitsWidget() {
  const { habits, logs, logHabit } = useHabitsStore();
  const { t } = useT();
  
  const today = new Date().toISOString().split("T")[0];
  const habitsToday = habits.slice(0, 4);
  const completedToday = habits.filter(h => 
    logs.some(l => l.habitId === h.id && isSameDay(parseISO(l.date), parseISO(today)) && l.completed)
  ).length;

  return (
    <Card3D>
      <Card className="h-full rounded-2xl shadow-sm border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <CardTitle className="text-sm font-bold">{t("dashboard.todayHabits")}</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {completedToday}/{habits.length}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {habitsToday.length > 0 ? (
                habitsToday.map((habit) => {
                  const isDone = logs.some(
                    (l) => l.habitId === habit.id && isSameDay(parseISO(l.date), parseISO(today)) && l.completed
                  );
                  return (
                    <motion.div
                      layout
                      key={habit.id}
                      className={cn(
                        "flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 transition-all",
                        isDone ? "bg-green-500/5" : "hover:bg-[var(--muted)]"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm flex-shrink-0">{habit.icon}</span>
                        <span className={cn(
                          "text-xs font-medium truncate",
                          isDone && "line-through text-[var(--muted-foreground)]"
                        )}>
                          {habit.name}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-6 w-6 rounded-full transition-all",
                          isDone ? "text-green-500 bg-green-500/10" : "text-[var(--muted-foreground)]"
                        )}
                        onClick={() => logHabit(habit.id, today, !isDone)}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="text-[10px] text-[var(--muted-foreground)] font-medium">
                    No habits for today.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <Link href="/habits" className="block w-full">
            <Button variant="ghost" className="w-full h-8 text-[11px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]">
              {t("dashboard.viewAll")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Card3D>
  );
}
