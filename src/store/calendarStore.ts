import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { CalendarEvent, EventColor } from "@/types";

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string; // ISO date string
  viewMode: "month" | "week" | "day";

  addEvent: (e: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: "month" | "week" | "day") => void;
  getEventsForDate: (date: string) => CalendarEvent[];
}

const now = () => new Date().toISOString();
const today = new Date();

const makeDate = (offsetDays: number, hour = 9, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [
        {
          id: generateId(),
          title: "Team Standup",
          description: "Daily sync with the engineering team",
          startDate: makeDate(0, 9, 0),
          endDate: makeDate(0, 9, 30),
          allDay: false,
          color: "blue" as EventColor,
          location: "Zoom",
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Design Review",
          description: "Review new UI mockups with design team",
          startDate: makeDate(1, 14, 0),
          endDate: makeDate(1, 15, 0),
          allDay: false,
          color: "purple" as EventColor,
          location: "Conference Room A",
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Product Launch 🚀",
          description: "Official product launch day",
          startDate: makeDate(5),
          endDate: makeDate(5),
          allDay: true,
          color: "green" as EventColor,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Q2 Planning",
          description: "Quarterly planning and goal setting",
          startDate: makeDate(3, 10, 0),
          endDate: makeDate(3, 12, 0),
          allDay: false,
          color: "orange" as EventColor,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Doctor Appointment",
          startDate: makeDate(-1, 11, 0),
          endDate: makeDate(-1, 11, 30),
          allDay: false,
          color: "red" as EventColor,
          location: "City Medical Center",
          createdAt: now(),
          updatedAt: now(),
        },
      ],
      selectedDate: new Date().toISOString().split("T")[0],
      viewMode: "month",

      addEvent: (e) =>
        set((state) => ({
          events: [
            { ...e, id: generateId(), createdAt: now(), updatedAt: now() },
            ...state.events,
          ],
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: now() } : e
          ),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (viewMode) => set({ viewMode }),

      getEventsForDate: (date) => {
        return get().events.filter((e) => {
          const start = e.startDate.split("T")[0];
          const end = e.endDate.split("T")[0];
          return start <= date && date <= end;
        });
      },
    }),
    { name: "psa-calendar" }
  )
);
