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
  Maximize,
  Minimize,
  Image as ImageIcon,
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

import { BackgroundRenderer } from "@/features/focus/components/BackgroundRenderer";
import { MusicPlayer } from "@/features/focus/components/MusicPlayer";
import { MusicControls } from "@/features/focus/components/MusicControls";
import { PlaylistDrawer } from "@/features/focus/components/PlaylistDrawer";
import { BackgroundSelector } from "@/features/focus/components/BackgroundSelector";

const modeConfig: Record<FocusMode, { label: string; icon: React.ElementType }> = {
  focus: { label: "Focus", icon: Brain },
  short_break: { label: "Short Break", icon: Coffee },
  long_break: { label: "Long Break", icon: Zap },
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
    isFullscreen,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    switchMode,
    updateSettings,
    toggleFullscreen,
  } = useFocusStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [bgSelectorOpen, setBgSelectorOpen] = useState(false);
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

  // Fullscreen API Listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocFullscreen = !!document.fullscreenElement;
      if (isDocFullscreen !== isFullscreen) {
        toggleFullscreen(isDocFullscreen);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFullscreen, toggleFullscreen]);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Error attempting to handle fullscreen:", err);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayFocusSessions = sessions.filter(
    (s) => s.mode === "focus" && s.completedAt?.startsWith(todayStr)
  );

  return (
    <div 
      className={cn(
        "relative h-full w-full flex flex-col items-center justify-center isolate p-6 overflow-hidden transition-all duration-500",
        isFullscreen ? "m-0 rounded-none border-none" : "m-2 rounded-xl border border-white/10 shadow-sm"
      )} 
      style={!isFullscreen ? { minHeight: "calc(100vh - 4rem)" } : {}}
    >
      <BackgroundRenderer />
      <MusicPlayer />
      <PlaylistDrawer open={playlistOpen} onOpenChange={setPlaylistOpen} />
      <BackgroundSelector open={bgSelectorOpen} onOpenChange={setBgSelectorOpen} />

      {/* Top right corner utilities */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
          onClick={() => setBgSelectorOpen(true)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hidden sm:flex"
          onClick={handleToggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Timer Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mt-[-5vh]">
        {/* Mode selector */}
        <div className="mb-10 inline-flex rounded-2xl border border-white/20 bg-black/20 backdrop-blur-md p-1.5 gap-2 shadow-2xl">
          {(Object.entries(modeConfig) as [FocusMode, typeof modeConfig[FocusMode]][]).map(([mode, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-xl",
                  currentMode === mode
                    ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Timer Box */}
        <div className="flex flex-col items-center text-white mb-16">
          <motion.span
            key={formatTime(timeLeft)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[80px] sm:text-[120px] font-bold tracking-tighter tabular-nums leading-none drop-shadow-2xl"
          >
            {formatTime(timeLeft)}
          </motion.span>
          
          <div className="mt-4 text-white/70 font-medium uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-12 h-[1px] bg-white/20" />
            Session {sessionCount + 1} / {settings.sessionsBeforeLongBreak}
            <span className="w-12 h-[1px] bg-white/20" />
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetTimer}
            className="h-14 w-14 rounded-full text-white hover:bg-white/20 border border-white/20 backdrop-blur-md"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            className="h-20 w-48 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] text-xl font-bold uppercase tracking-wider"
          >
            {isRunning ? (
              <><Pause className="h-6 w-6 mr-3" /> Pause</>
            ) : (
              <><Play className="h-6 w-6 mr-3 ml-1" /> Start</>
            )}
          </Button>
        </div>
      </div>

      {/* Footer Music Controls & Stats snippet */}
      <div className="absolute overflow-y-auto max-h-[80vh] hide-scrollbar inset-x-6 bottom-6 flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 pb-[env(safe-area-inset-bottom)] pointer-events-none">
        {/* Left side: Quick Stats (hidden on very small screens) */}
        <div className="hidden lg:flex items-center gap-4 pointer-events-auto">
          <div className="flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 text-white shadow-2xl min-w-[120px]">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5"><CheckCircle className="w-3 h-3"/> Sessions Today</span>
            <span className="text-2xl font-bold">{todayFocusSessions.length}</span>
          </div>
          <div className="flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 text-white shadow-2xl min-w-[120px]">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3"/> Total Time</span>
            <span className="text-2xl font-bold">{todayFocusSessions.length * settings.focusDuration}m</span>
          </div>
        </div>

        {/* Right / Bottom Center: Music Controls */}
        <div className="pointer-events-auto w-full lg:w-auto flex justify-center">
          <MusicControls onOpenPlaylist={() => setPlaylistOpen(true)} />
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent aria-describedby={undefined} className="bg-[#111] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Focus Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Focus (min)", key: "focusDuration" },
                { label: "Short Break (min)", key: "shortBreakDuration" },
                { label: "Long Break (min)", key: "longBreakDuration" },
                { label: "Sessions to Long Break", key: "sessionsBeforeLongBreak" },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">{label}</label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={(settingsForm as unknown as Record<string, number>)[key]}
                    onChange={(e) =>
                      setSettingsForm((f) => ({ ...f, [key]: parseInt(e.target.value) || 1 }))
                    }
                    className="bg-white/5 border-white/10 text-white font-mono"
                  />
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-sm font-semibold">Auto-start breaks</span>
              <input
                type="checkbox"
                checked={settingsForm.autoStartBreaks}
                onChange={(e) => setSettingsForm((f) => ({ ...f, autoStartBreaks: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-transparent text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-black"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 border-t border-white/10 pt-4">
            <Button variant="ghost" className="text-white/70 hover:text-white" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button className="bg-white text-black hover:bg-white/90 font-bold" onClick={() => { updateSettings(settingsForm); setSettingsOpen(false); }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
