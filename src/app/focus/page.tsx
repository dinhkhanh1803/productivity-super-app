"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Brain,
  Coffee,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useFocusStore } from "@/store/focusStore";
import type { FocusMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const modeConfig: Record<FocusMode, { label: string; icon: React.ElementType; color: string; ring: string }> = {
  focus: { label: "Focus", icon: Brain, color: "from-[var(--primary)] to-[var(--accent)]", ring: "ring-[var(--primary)]" },
  short_break: { label: "Short Break", icon: Coffee, color: "from-emerald-500 to-teal-500", ring: "ring-emerald-500" },
  long_break: { label: "Long Break", icon: Zap, color: "from-orange-500 to-amber-500", ring: "ring-orange-500" },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FocusPage() {
  const {
    settings,
    sessions,
    currentMode,
    timeLeft,
    isRunning,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    switchMode,
    updateSettings,
  } = useFocusStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(settings);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  // Update page title
  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(timeLeft)} — ${modeConfig[currentMode].label} | Focus`
      : "Focus | Productivity Super App";
    return () => { document.title = "Productivity Super App"; };
  }, [timeLeft, isRunning, currentMode]);

  const totalDuration = currentMode === "focus"
    ? settings.focusDuration * 60
    : currentMode === "short_break"
    ? settings.shortBreakDuration * 60
    : settings.longBreakDuration * 60;

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const { color, ring, icon: ModeIcon } = modeConfig[currentMode];

  const todayStr = new Date().toISOString().split("T")[0];
  const todayFocusSessions = sessions.filter(
    (s) => s.mode === "focus" && s.completedAt?.startsWith(todayStr)
  );

  const r = 120;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Mode selector */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--muted)] p-1 gap-1">
          {(Object.entries(modeConfig) as [FocusMode, typeof modeConfig[FocusMode]][]).map(([mode, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                  currentMode === mode
                    ? "bg-[var(--card)] shadow text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
                id={`mode-${mode}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <svg width={280} height={280} className="rotate-[-90deg]">
            {/* Background circle */}
            <circle
              cx={140}
              cy={140}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeWidth={8}
            />
            {/* Progress circle */}
            <motion.circle
              cx={140}
              cy={140}
              r={r}
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time display */}
          <div className="absolute flex flex-col items-center">
            <motion.span
              key={formatTime(timeLeft)}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold tracking-tight tabular-nums text-[var(--foreground)]"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className="text-sm text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
              <ModeIcon className="h-3.5 w-3.5" />
              {modeConfig[currentMode].label}
            </span>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Session {sessionCount + 1} of {settings.sessionsBeforeLongBreak}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="icon" onClick={resetTimer} id="timer-reset-btn">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={isRunning ? pauseTimer : startTimer}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br shadow-lg text-white",
              color
            )}
            id="timer-toggle-btn"
          >
            <AnimatePresence mode="wait">
              {isRunning ? (
                <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Pause className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Play className="h-6 w-6 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)} id="timer-settings-btn">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Sessions", value: todayFocusSessions.length, icon: CheckCircle, color: "text-[var(--primary)]" },
          { label: "Focus Time", value: `${todayFocusSessions.length * settings.focusDuration}m`, icon: Clock, color: "text-orange-500" },
          { label: "All Time", value: sessions.filter((s) => s.mode === "focus").length, icon: Brain, color: "text-[var(--accent)]" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <Icon className={cn("h-5 w-5 mx-auto mb-2", stat.color)} />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center gap-3 text-sm">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    session.mode === "focus"
                      ? "bg-[var(--primary)]"
                      : session.mode === "short_break"
                      ? "bg-emerald-500"
                      : "bg-orange-500"
                  )}
                />
                <span className="flex-1 capitalize">{session.mode.replace("_", " ")}</span>
                <span className="text-[var(--muted-foreground)]">{session.duration}m</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {session.completedAt
                    ? new Date(session.completedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: "Focus Duration (minutes)", key: "focusDuration" },
              { label: "Short Break (minutes)", key: "shortBreakDuration" },
              { label: "Long Break (minutes)", key: "longBreakDuration" },
              { label: "Sessions before long break", key: "sessionsBeforeLongBreak" },
            ].map(({ label, key }) => (
              <Input
                key={key}
                label={label}
                type="number"
                min={1}
                max={120}
                value={(settingsForm as unknown as Record<string, number>)[key]}
                onChange={(e) =>
                  setSettingsForm((f) => ({ ...f, [key]: parseInt(e.target.value) || 1 }))
                }
                id={`settings-${key}`}
              />
            ))}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-break"
                checked={settingsForm.autoStartBreaks}
                onChange={(e) => setSettingsForm((f) => ({ ...f, autoStartBreaks: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="auto-break" className="text-sm cursor-pointer">Auto-start breaks</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => { updateSettings(settingsForm); setSettingsOpen(false); }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
