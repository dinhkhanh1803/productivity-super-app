import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { Todo, TodoPriority, TodoStatus } from "@/types";

interface TodoState {
  todos: Todo[];
  filter: TodoStatus | "all";
  priorityFilter: TodoPriority | "all";
  searchQuery: string;

  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: TodoStatus | "all") => void;
  setPriorityFilter: (priority: TodoPriority | "all") => void;
  setSearchQuery: (query: string) => void;
  clearCompleted: () => void;
}

const now = () => new Date().toISOString();

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [
        {
          id: generateId(),
          title: "Design the new landing page",
          description: "Create wireframes and mockups for the homepage redesign",
          status: "in_progress",
          priority: "high",
          dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
          tags: ["design", "web"],
          completed: false,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Review Q2 financial report",
          description: "Check the quarterly numbers and prepare summary",
          status: "todo",
          priority: "medium",
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          tags: ["finance"],
          completed: false,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Set up CI/CD pipeline",
          description: "Configure GitHub Actions for automated deployments",
          status: "todo",
          priority: "high",
          tags: ["devops"],
          completed: false,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Write unit tests for auth module",
          status: "done",
          priority: "medium",
          tags: ["testing"],
          completed: true,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Update project dependencies",
          status: "done",
          priority: "low",
          tags: ["maintenance"],
          completed: true,
          createdAt: now(),
          updatedAt: now(),
        },
      ],
      filter: "all",
      priorityFilter: "all",
      searchQuery: "",

      addTodo: (todo) =>
        set((state) => ({
          todos: [
            { ...todo, id: generateId(), createdAt: now(), updatedAt: now() },
            ...state.todos,
          ],
        })),

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: now() } : t
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  status: !t.completed ? "done" : "todo",
                  updatedAt: now(),
                }
              : t
          ),
        })),

      setFilter: (filter) => set({ filter }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((t) => !t.completed),
        })),
    }),
    { name: "psa-todos" }
  )
);
