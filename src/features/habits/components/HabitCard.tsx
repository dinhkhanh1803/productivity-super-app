"use client";

import { Habit } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Trash2, 
  Bell, 
  Flame, 
  MoreVertical,
  Calendar
} from "lucide-react";
import { useHabitsStore } from "@/store/habitsStore";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, isSameDay, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { deleteHabit, logHabit, logs } = useHabitsStore();
  
  const today = new Date().toISOString().split("T")[0];
  const isDoneToday = logs.some(
    (l) => l.habitId === habit.id && isSameDay(parseISO(l.date), parseISO(today)) && l.completed
  );

  const toggleToday = () => {
    logHabit(habit.id, today, !isDoneToday);
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md transition-all hover:shadow-lg",
        isDoneToday && "border-green-500/50 bg-green-500/5"
      )}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm transition-all duration-300",
                  isDoneToday ? "scale-90 bg-green-500/20" : "bg-[var(--accent)]"
                )}
                style={{ color: !isDoneToday ? habit.color : undefined }}
              >
                {habit.icon}
              </div>
              
              <div className="space-y-1">
                <h3 className={cn(
                  "text-base font-bold transition-all",
                  isDoneToday && "line-through text-green-500/70"
                )}>
                  {habit.name}
                </h3>
                <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-wider text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {habit.frequency}
                  </span>
                  {habit.reminderTime && (
                    <span className="flex items-center gap-1">
                      <Bell className="h-3 w-3" />
                      {habit.reminderTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center pr-2">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className={cn("h-4 w-4", habit.streak > 0 && "animate-pulse")} fill="currentColor" />
                  <span className="text-sm font-bold">{habit.streak}</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-[var(--muted-foreground)]">Streak</span>
              </div>

              <Button
                variant={isDoneToday ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300 shadow-lg",
                  isDoneToday 
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20" 
                    : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                )}
                onClick={toggleToday}
              >
                <CheckCircle2 className={cn("h-6 w-6 transition-transform", isDoneToday && "scale-110")} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => deleteHabit(habit.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
        
        {/* Progress indicator border-bottom */}
        <AnimatePresence>
          {isDoneToday && (
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 h-0.5 w-full bg-green-500 rounded-full origin-left"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
