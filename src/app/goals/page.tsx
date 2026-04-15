import { Metadata } from "next";
import { GoalList } from "@/features/goals/components/GoalList";
import { Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Personal Goals | Productivity Super App",
  description: "Track and manage your short-term and long-term goals.",
};

export default function GoalsPage() {
  return (
    <div className="min-h-full max-w-[1400px] mx-auto px-5 py-7 sm:px-8 sm:py-9 space-y-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Target className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Goals</h1>
        </div>
        <p className="text-[var(--muted-foreground)] max-w-2xl">
          Set ambitious targets, track your progress, and celebrate your achievements. 
          Break down your vision into manageable short-term and long-term goals.
        </p>
      </div>

      <GoalList />
    </div>
  );
}
