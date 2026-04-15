"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { Goal, GoalType } from "@/types";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGoalsStore } from "@/store/goalsStore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["short_term", "long_term"]),
  targetDate: z.string().min(1, "Target date is required"),
  progress: z.coerce.number().min(0).max(100),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormProps {
  goal?: Goal | null;
  onSuccess: () => void;
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const { addGoal, updateGoal } = useGoalsStore();
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(goalSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      type: "short_term",
      targetDate: new Date().toISOString().split("T")[0],
      progress: 0,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title,
        description: goal.description || "",
        type: goal.type,
        targetDate: goal.targetDate.split("T")[0],
        progress: goal.progress,
      });
    } else {
      reset({
        title: "",
        description: "",
        type: "short_term",
        targetDate: new Date().toISOString().split("T")[0],
        progress: 0,
      });
    }
  }, [goal, reset]);

  const onSubmit = (data: GoalFormValues) => {
    if (goal) {
      updateGoal(goal.id, {
        ...data,
        targetDate: new Date(data.targetDate).toISOString(),
      });
    } else {
      addGoal({
        ...data,
        status: "active",
        targetDate: new Date(data.targetDate).toISOString(),
      });
    }
    onSuccess();
  };

  return (
    <DialogContent className="sm:max-w-[425px] border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <Input
          label="Goal Title"
          placeholder="e.g., Run a Marathon"
          error={errors.title?.message}
          {...register("title")}
        />
        
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Description (Optional)</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="What's the plan?"
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Goal Type</Label>
            <Select 
              value={selectedType} 
              onValueChange={(val: GoalType) => setValue("type", val)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">Short Term</SelectItem>
                <SelectItem value="long_term">Long Term</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            label="Target Date"
            type="date"
            error={errors.targetDate?.message}
            {...register("targetDate")}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Progress ({watch("progress")}%)</Label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            className="w-full h-1.5 bg-[var(--secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            {...register("progress")}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="submit" className="w-full font-semibold">
            {goal ? "Save Changes" : "Create Goal"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
