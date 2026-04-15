/** Base entity with id and timestamps */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/* ───── Todo ───── */
export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "todo" | "in_progress" | "done";

export interface Todo extends BaseEntity {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  tags: string[];
  completed: boolean;
}

/* ───── Finance ───── */
export type TransactionType = "income" | "expense";
export type TransactionCategory =
  | "salary"
  | "food"
  | "transport"
  | "entertainment"
  | "health"
  | "utilities"
  | "housing"
  | "savings"
  | "other";

export interface Transaction extends BaseEntity {
  title: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  note?: string;
}

export interface Budget {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

/* ───── Calendar ───── */
export type EventColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange";

export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  color: EventColor;
  location?: string;
}

/* ───── Focus / Pomodoro ───── */
export type FocusMode = "focus" | "short_break" | "long_break";

export interface FocusSession extends BaseEntity {
  duration: number; // minutes
  mode: FocusMode;
  completedAt?: string;
  task?: string;
}

export interface FocusSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export type BackgroundType = "image" | "video" | "color";

export interface FocusBackground {
  type: BackgroundType;
  url: string;
  opacity?: number;
}

export type TrackType = "local" | "online" | "preset";

export interface Track {
  id: string;
  title: string;
  url: string;
  type: TrackType;
  duration?: number;
}

/* ───── Notes ───── */
export interface Note extends BaseEntity {
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  color?: string;
}

/* ───── User ───── */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  timezone: string;
}

/* ───── Goals ───── */
export type GoalType = "short_term" | "long_term";
export type GoalStatus = "active" | "completed";

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  type: GoalType;
  status: GoalStatus;
  targetDate: string;
  progress: number; // 0-100
}

/* ───── Habits ───── */
export type HabitFrequency = "daily" | "weekly";

export interface Habit extends BaseEntity {
  name: string;
  icon: string;
  frequency: HabitFrequency;
  reminderTime?: string; // HH:mm
  color?: string;
  streak: number;
}

export interface HabitLog extends BaseEntity {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

/* ───── Navigation ───── */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
}

/* ───── Generic ───── */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
