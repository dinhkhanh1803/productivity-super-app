import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { FocusMode, FocusSession, FocusSettings } from "@/types";

interface FocusState {
  settings: FocusSettings;
  sessions: FocusSession[];
  currentMode: FocusMode;
  timeLeft: number; // seconds
  isRunning: boolean;
  sessionCount: number; // completed focus sessions this cycle

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchMode: (mode: FocusMode) => void;
  completeSession: () => void;
  updateSettings: (s: Partial<FocusSettings>) => void;
}

const defaultSettings: FocusSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
};

function getDuration(mode: FocusMode, settings: FocusSettings): number {
  switch (mode) {
    case "focus":
      return settings.focusDuration * 60;
    case "short_break":
      return settings.shortBreakDuration * 60;
    case "long_break":
      return settings.longBreakDuration * 60;
  }
}

const now = () => new Date().toISOString();

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      sessions: [],
      currentMode: "focus",
      timeLeft: defaultSettings.focusDuration * 60,
      isRunning: false,
      sessionCount: 0,

      startTimer: () => set({ isRunning: true }),
      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () => {
        const { currentMode, settings } = get();
        set({ isRunning: false, timeLeft: getDuration(currentMode, settings) });
      },

      tick: () => {
        const { timeLeft, completeSession } = get();
        if (timeLeft <= 1) {
          completeSession();
        } else {
          set({ timeLeft: timeLeft - 1 });
        }
      },

      switchMode: (mode) => {
        const { settings } = get();
        set({ currentMode: mode, timeLeft: getDuration(mode, settings), isRunning: false });
      },

      completeSession: () => {
        const { currentMode, sessionCount, settings } = get();
        const newSession: FocusSession = {
          id: generateId(),
          duration:
            currentMode === "focus"
              ? settings.focusDuration
              : currentMode === "short_break"
              ? settings.shortBreakDuration
              : settings.longBreakDuration,
          mode: currentMode,
          completedAt: now(),
          createdAt: now(),
          updatedAt: now(),
        };

        let nextMode: FocusMode = "focus";
        let nextCount = sessionCount;

        if (currentMode === "focus") {
          nextCount = sessionCount + 1;
          nextMode =
            nextCount % settings.sessionsBeforeLongBreak === 0
              ? "long_break"
              : "short_break";
        }

        set((state) => ({
          sessions: [newSession, ...state.sessions],
          currentMode: nextMode,
          sessionCount: nextCount,
          timeLeft: getDuration(nextMode, settings),
          isRunning: settings.autoStartBreaks && nextMode !== "focus",
        }));
      },

      updateSettings: (s) => {
        set((state) => {
          const newSettings = { ...state.settings, ...s };
          return {
            settings: newSettings,
            timeLeft: getDuration(state.currentMode, newSettings),
            isRunning: false,
          };
        });
      },
    }),
    { name: "psa-focus", partialize: (s) => ({ settings: s.settings, sessions: s.sessions, sessionCount: s.sessionCount }) }
  )
);
