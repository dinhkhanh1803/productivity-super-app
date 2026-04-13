"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Lightbulb, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Suggestion {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  cta?: string;
}

const suggestions: Suggestion[] = [
  {
    id: "1",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/12",
    title: "You're 40% through your tasks",
    body: "You've completed 2 of 5 tasks today. Finish 2 more and you'll exceed your daily goal!",
    cta: "View tasks",
  },
  {
    id: "2",
    icon: Lightbulb,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/12",
    title: "Best focus time approaching",
    body: "Studies show 10–12 AM is peak focus for most people. You have 1 hour left — try a Pomodoro session.",
    cta: "Start focus",
  },
  {
    id: "3",
    icon: CheckCircle2,
    iconColor: "text-[var(--primary)]",
    iconBg: "bg-[var(--primary)]/12",
    title: "Break reminder",
    body: "You haven't taken a break in the past session. A 5-minute walk can boost productivity by 30%.",
  },
];

export function AIAssistantSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.35 }}
    >
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Gradient header bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-purple-500" />

        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
            <span className="ml-auto rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wide">
              Live insights
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-5">
          {suggestions.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="group flex flex-col gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 p-3.5 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-all duration-200 cursor-default"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg}`}>
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)] leading-snug">{item.title}</p>
                  <p className="mt-1 text-[11px] text-[var(--muted-foreground)] leading-relaxed">{item.body}</p>
                </div>
                {item.cta && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-auto h-7 w-full justify-between rounded-lg text-[11px] text-[var(--primary)] hover:bg-[var(--primary)]/10 px-2"
                  >
                    {item.cta}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
