"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Trash2,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { useCalendarStore } from "@/store/calendarStore";
import type { CalendarEvent, EventColor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const eventColorMap: Record<EventColor, { bg: string; text: string; dot: string }> = {
  blue: { bg: "bg-blue-500/20", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  green: { bg: "bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  red: { bg: "bg-red-500/20", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
  yellow: { bg: "bg-yellow-500/20", text: "text-yellow-700 dark:text-yellow-300", dot: "bg-yellow-500" },
  purple: { bg: "bg-purple-500/20", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
  orange: { bg: "bg-orange-500/20", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { events, addEvent, deleteEvent, getEventsForDate } = useCalendarStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endDate: new Date().toISOString().split("T")[0],
    endTime: "10:00",
    allDay: false,
    color: "blue" as EventColor,
    location: "",
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedEvents = getEventsForDate(selectedDateStr);

  function handleSubmit() {
    if (!form.title) return;
    const startDate = form.allDay
      ? new Date(form.startDate).toISOString()
      : new Date(`${form.startDate}T${form.startTime}`).toISOString();
    const endDate = form.allDay
      ? new Date(form.endDate).toISOString()
      : new Date(`${form.endDate}T${form.endTime}`).toISOString();

    addEvent({
      title: form.title,
      description: form.description,
      startDate,
      endDate,
      allDay: form.allDay,
      color: form.color,
      location: form.location,
    });
    setIsAddOpen(false);
  }

  function getDayEvents(day: Date) {
    const str = format(day, "yyyy-MM-dd");
    return getEventsForDate(str).slice(0, 3);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => subMonths(d, 1))}
            id="prev-month-btn"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-bold min-w-[160px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate((d) => addMonths(d, 1))}
            id="next-month-btn"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
          >
            Today
          </Button>
        </div>
        <Button onClick={() => setIsAddOpen(true)} id="add-event-btn">
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-[var(--muted-foreground)] py-2">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-lg overflow-hidden">
                {days.map((day) => {
                  const dayEvents = getDayEvents(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const todayDay = isToday(day);

                  return (
                    <motion.div
                      key={day.toISOString()}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "bg-[var(--card)] min-h-[80px] p-1.5 cursor-pointer transition-colors hover:bg-[var(--muted)]",
                        isSelected && "bg-[var(--primary)]/10 hover:bg-[var(--primary)]/15",
                        !isCurrentMonth && "opacity-40"
                      )}
                    >
                      <div className="flex justify-end mb-1">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                            todayDay && "bg-[var(--primary)] text-white",
                            isSelected && !todayDay && "ring-2 ring-[var(--primary)]"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.map((event) => {
                          const colors = eventColorMap[event.color];
                          return (
                            <div
                              key={event.id}
                              className={cn(
                                "truncate rounded px-1 py-0.5 text-[10px] font-medium",
                                colors.bg,
                                colors.text
                              )}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected day events */}
        <div>
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-base">
                  {format(selectedDate, "EEEE, MMMM d")}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
                </p>
              </div>

              {selectedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-3xl mb-3">📅</div>
                  <p className="text-sm text-[var(--muted-foreground)]">No events</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 text-xs"
                    onClick={() => setIsAddOpen(true)}
                  >
                    Add event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((event) => {
                    const colors = eventColorMap[event.color];
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn("rounded-xl p-3", colors.bg)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-semibold", colors.text)}>
                              {event.title}
                            </p>
                            {event.description && (
                              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            {!event.allDay && (
                              <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mt-1.5">
                                <Clock className="h-3 w-3" />
                                {format(new Date(event.startDate), "h:mm a")} –{" "}
                                {format(new Date(event.endDate), "h:mm a")}
                              </p>
                            )}
                            {event.location && (
                              <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] mt-0.5">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        {event.allDay && (
                          <span className="mt-1.5 inline-block text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                            All day
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              id="event-title-input"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
                rows={2}
                placeholder="Optional..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="event-all-day"
                checked={form.allDay}
                onChange={(e) => setForm((f) => ({ ...f, allDay: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="event-all-day" className="text-sm font-medium cursor-pointer">All day</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                id="event-start-date"
              />
              {!form.allDay && (
                <Input
                  label="Start Time"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  id="event-start-time"
                />
              )}
              <Input
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                id="event-end-date"
              />
              {!form.allDay && (
                <Input
                  label="End Time"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  id="event-end-time"
                />
              )}
            </div>
            <Input
              label="Location"
              placeholder="Optional location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              id="event-location-input"
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {(Object.keys(eventColorMap) as EventColor[]).map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setForm((f) => ({ ...f, color }))}
                    className={cn(
                      "h-7 w-7 rounded-full transition-transform",
                      eventColorMap[color].dot,
                      form.color === color ? "scale-125 ring-2 ring-[var(--ring)] ring-offset-2" : "hover:scale-110"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.title}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
