"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HabitFrequency } from "@/types";
import { cn } from "@/lib/utils";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHabitsStore } from "@/store/habitsStore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const habitSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Icon is required"),
  frequency: z.enum(["daily", "weekly"]),
  reminderTime: z.string().optional(),
  color: z.string().optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  onSuccess: () => void;
}

const EMOJI_OPTIONS = ["💧", "🏋️", "🧘", "📚", "🍎", "☀️", "🌙", "🚶", "💻", "🎨"];
const COLOR_OPTIONS = [
  { label: "Blue", value: "var(--primary)" },
  { label: "Green", value: "#10b981" },
  { label: "Orange", value: "#f59e0b" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
];

export function HabitForm({ onSuccess }: HabitFormProps) {
  const { addHabit } = useHabitsStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      icon: "💧",
      frequency: "daily",
      reminderTime: "08:00",
      color: "var(--primary)",
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("color");
  const selectedFrequency = watch("frequency");

  const onSubmit = (data: HabitFormValues) => {
    addHabit(data);
    onSuccess();
  };

  return (
    <DialogContent className="sm:max-w-[425px] border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl">
      <DialogHeader>
        <DialogTitle>Add New Habit</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <Input
          label="Habit Name"
          placeholder="e.g., Drink water"
          error={errors.name?.message}
          {...register("name")}
        />
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Icon / Emoji</Label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--input)] transition-all",
                  selectedIcon === emoji ? "bg-[var(--primary)] text-white scale-110 shadow-lg" : "hover:bg-[var(--accent)]"
                )}
                onClick={() => setValue("icon", emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Frequency</Label>
            <Select 
              value={selectedFrequency} 
              onValueChange={(val: HabitFrequency) => setValue("frequency", val)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Input
            label="Reminder Time"
            type="time"
            error={errors.reminderTime?.message}
            {...register("reminderTime")}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Card Theme Color</Label>
          <div className="flex gap-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={cn(
                  "h-6 w-6 rounded-full border-2 border-transparent transition-all",
                  selectedColor === color.value ? "border-white scale-125 shadow-md" : "hover:scale-110"
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => setValue("color", color.value)}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="submit" className="w-full font-semibold">
            Add Habit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
