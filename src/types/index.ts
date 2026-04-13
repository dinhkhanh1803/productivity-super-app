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
