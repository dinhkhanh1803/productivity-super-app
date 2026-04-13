"use client";

import { useState, useEffect } from "react";

export interface ClockState {
  dayOfWeek: string;   // e.g. "Monday"
  date: string;        // e.g. "13/04/2026"
  time: string;        // e.g. "22:45:30"
  hours: number;       // 0-23, for greeting logic
}

export function useRealTimeClock(): ClockState {
  const [now, setNow] = useState<ClockState>(() => formatDate(new Date()));

  useEffect(() => {
    const id = setInterval(() => setNow(formatDate(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date): ClockState {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return {
    dayOfWeek: DAYS[d.getDay()],
    date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    hours: d.getHours(),
  };
}
