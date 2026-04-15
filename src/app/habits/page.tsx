import { Metadata } from "next";
import { HabitList } from "@/features/habits/components/HabitList";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Habits | Productivity Super App",
  description: "Track and build better daily routines.",
};

export default function HabitsPage() {
  return (
    <div className="min-h-full max-w-[1400px] mx-auto px-5 py-7 sm:px-8 sm:py-9 space-y-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
        </div>
        <p className="text-[var(--muted-foreground)] max-w-2xl text-lg font-medium">
          Consistency is the key to mastery. Build your ideal routines and 
          watch your streaks grow every single day.
        </p>
      </div>

      <HabitList />
    </div>
  );
}
