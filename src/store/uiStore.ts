import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark" | "system";
  commandPaletteOpen: boolean;
  notifications: Notification[];

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleCommandPalette: () => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: "system",
      commandPaletteOpen: false,
      notifications: [
        {
          id: "1",
          title: "Welcome! 🎉",
          message: "Your Productivity Super App is ready to use.",
          type: "success",
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: "2",
          title: "Task Due Soon",
          message: "\"Design landing page\" is due in 2 days.",
          type: "warning",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
        },
      ],

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      toggleCommandPalette: () =>
        set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

      addNotification: (n) =>
        set((s) => ({
          notifications: [
            {
              ...n,
              id: Math.random().toString(36).slice(2),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "psa-ui", partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }) }
  )
);
