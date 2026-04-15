"use client";

import { Goal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Calendar, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  Trash2,
  Edit2
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useGoalsStore } from "@/store/goalsStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const { deleteGoal, toggleGoalStatus } = useGoalsStore();
  
  const isCompleted = goal.status === "completed";
  const isOverdue = !isCompleted && new Date(goal.targetDate) < new Date();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative overflow-hidden border-[var(--border)] bg-[var(--card)]/40 backdrop-blur-md transition-all hover:shadow-xl",
        isCompleted && "opacity-80"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-colors",
                goal.type === "long_term" 
                  ? "bg-purple-500/10 text-purple-500" 
                  : "bg-blue-500/10 text-blue-500",
                isCompleted && "bg-green-500/10 text-green-500"
              )}>
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className={cn(
                  "text-base font-bold leading-none",
                  isCompleted && "line-through text-[var(--muted-foreground)]"
                )}>
                  {goal.title}
                </CardTitle>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
                    {goal.type.replace("_", " ")}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-[9px] uppercase">Overdue</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleGoalStatus(goal.id)}>
                  {isCompleted ? "Mark Active" : "Mark Completed"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => deleteGoal(goal.id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {goal.description && (
            <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="text-[var(--muted-foreground)]">Progress</span>
              <span className="text-[var(--foreground)]">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-1.5" indicatorClassName={cn(
              goal.progress > 75 ? "bg-green-500" : goal.progress > 30 ? "bg-blue-500" : "bg-orange-500"
            )} />
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)] font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>Target: {format(parseISO(goal.targetDate), "MMM dd, yyyy")}</span>
            </div>
            
            {!isCompleted && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] hover:bg-green-500/10 hover:text-green-500 transition-colors"
                onClick={() => toggleGoalStatus(goal.id)}
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
        
        {/* Decorative corner accent */}
        <div className={cn(
          "absolute -right-6 -top-6 h-12 w-12 rotate-45 transition-colors",
          goal.type === "long_term" ? "bg-purple-500/5" : "bg-blue-500/5",
          isCompleted && "bg-green-500/10"
        )} />
      </Card>
    </motion.div>
  );
}
