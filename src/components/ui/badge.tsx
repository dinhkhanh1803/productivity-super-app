import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  size?: "sm" | "default";
}

function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        size === "default" ? "px-2.5 py-0.5 text-xs" : "px-2 py-px text-[10px]",
        {
          default:
            "bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30",
          secondary:
            "bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)]",
          destructive:
            "bg-[var(--destructive)]/15 text-[var(--destructive)] border border-[var(--destructive)]/30",
          outline:
            "border border-[var(--border)] text-[var(--foreground)]",
          success:
            "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
          warning:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
