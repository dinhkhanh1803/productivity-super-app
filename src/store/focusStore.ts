import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { FocusMode, FocusSession, FocusSettings, Track, FocusBackground } from "@/types";

interface FocusState {
  settings: FocusSettings;
  sessions: FocusSession[];
  currentMode: FocusMode;
  timeLeft: number; // seconds
  isRunning: boolean;
  sessionCount: number; // completed focus sessions this cycle

  // New states
  isPlayingTrack: boolean;
  currentTrack: Track | null;
  playlist: Track[];
  volume: number;
  background: FocusBackground;
  isFullscreen: boolean;


  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchMode: (mode: FocusMode) => void;
  completeSession: () => void;
  updateSettings: (s: Partial<FocusSettings>) => void;

  // New actions
  setTrack: (track: Track | null) => void;
  togglePlayback: () => void;
  setIsPlayingTrack: (isPlaying: boolean) => void;
  setVolume: (vol: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  setBackground: (bg: FocusBackground) => void;
  toggleFullscreen: (force?: boolean) => void;
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

      isPlayingTrack: false,
      currentTrack: null,
      playlist: [
        { id: "preset-lofi-1", title: "Lofi Study Girl", type: "preset", url: "https://r.mkhairi.com/lofi" }
      ],
      volume: 50,
      background: { type: "color", url: "var(--background)" },
      isFullscreen: false,


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

      setTrack: (track) => set({ currentTrack: track, isPlayingTrack: !!track }),
      togglePlayback: () => set((state) => {
        if (!state.currentTrack) {
          if (!state.playlist.length) return {};
          return {
            currentTrack: state.playlist[0],
            isPlayingTrack: true,
          };
        }

        return { isPlayingTrack: !state.isPlayingTrack };
      }),
      setIsPlayingTrack: (isPlayingTrack) => set({ isPlayingTrack }),
      setVolume: (volume) => set({ volume }),
      
      nextTrack: () => set((state) => {
        if (!state.playlist.length) return {};
        if (!state.currentTrack) return { currentTrack: state.playlist[0] };
        const idx = state.playlist.findIndex((t) => t.id === state.currentTrack?.id);
        const nextIdx = (idx + 1) % state.playlist.length;
        return { currentTrack: state.playlist[nextIdx] };
      }),
      
      prevTrack: () => set((state) => {
        if (!state.playlist.length) return {};
        if (!state.currentTrack) return { currentTrack: state.playlist[0] };
        const idx = state.playlist.findIndex((t) => t.id === state.currentTrack?.id);
        const prevIdx = idx <= 0 ? state.playlist.length - 1 : idx - 1;
        return { currentTrack: state.playlist[prevIdx] };
      }),

      addTrack: (track) => set((state) => {
        const exists = state.playlist.some((t) => t.id === track.id);
        if (exists) return {};
        return { playlist: [track, ...state.playlist] };
      }),

      removeTrack: (trackId) => set((state) => ({
        playlist: state.playlist.filter((t) => t.id !== trackId),
        currentTrack: state.currentTrack?.id === trackId ? null : state.currentTrack
      })),

      setBackground: (background) => set({ background }),
      
      toggleFullscreen: (force) => set((state) => ({
        isFullscreen: force !== undefined ? force : !state.isFullscreen
      })),
    }),
    {
      name: "psa-focus",
      partialize: (s) => {
        const persistedPlaylist = s.playlist.filter((track) => track.type !== "local");
        const persistedCurrentTrack =
          s.currentTrack?.type === "local" ? null : s.currentTrack;

        return {
          settings: s.settings,
          sessions: s.sessions,
          sessionCount: s.sessionCount,
          playlist: persistedPlaylist,
          background: s.background,
          volume: s.volume,
          currentTrack: persistedCurrentTrack,
        };
      }
    }
  )
);
