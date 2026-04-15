"use client";

import { useGoalsStore } from "@/store/goalsStore";
import { useT } from "@/hooks/useT";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3D } from "@/components/ui/card-3d";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function GoalsWidget() {
  const { goals } = useGoalsStore();
  const { t } = useT();
  
  const activeGoals = goals
    .filter(g => g.status === "active")
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3);

  return (
    <Card3D>
      <Card className="h-full rounded-2xl shadow-sm border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15">
                <Target className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <CardTitle className="text-sm font-bold">{t("dashboard.activeGoals")}</CardTitle>
            </div>
            <Link href="/goals">
              <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <div key={goal.id} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="truncate max-w-[150px]">{goal.title}</span>
                  <span className="text-[var(--muted-foreground)]">{goal.progress}%</span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="h-1" 
                  indicatorClassName={cn(
                    goal.type === "long_term" ? "bg-purple-500" : "bg-blue-500"
                  )}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <p className="text-[10px] text-[var(--muted-foreground)] font-medium">
                No active goals. Time to set some!
              </p>
            </div>
          )}
          
          <Link href="/goals" className="block w-full">
            <Button variant="ghost" className="w-full h-8 text-[11px] font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]">
              {t("dashboard.viewAll")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Card3D>
  );
}
