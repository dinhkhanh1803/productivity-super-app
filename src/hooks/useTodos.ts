"use client";

import { useTodoStore } from "@/store/todoStore";
import type { Todo, TodoPriority, TodoStatus } from "@/types";
import { useMemo } from "react";

export function useTodos() {
  const store = useTodoStore();

  const filteredTodos = useMemo(() => {
    return store.todos.filter((t) => {
      const matchesFilter =
        store.filter === "all" || t.status === store.filter ||
        (store.filter === "done" && t.completed) ||
        (store.filter === "todo" && !t.completed);
      const matchesSearch =
        !store.searchQuery ||
        t.title.toLowerCase().includes(store.searchQuery.toLowerCase()) ||
        t.tags.some((tag) => tag.includes(store.searchQuery.toLowerCase()));
      const matchesPriority =
        store.priorityFilter === "all" || t.priority === store.priorityFilter;
      return matchesFilter && matchesSearch && matchesPriority;
    });
  }, [store.todos, store.filter, store.searchQuery, store.priorityFilter]);

  const stats = useMemo(() => ({
    total: store.todos.length,
    completed: store.todos.filter((t) => t.completed).length,
    pending: store.todos.filter((t) => !t.completed).length,
    highPriority: store.todos.filter((t) => t.priority === "high" && !t.completed).length,
    completionRate: store.todos.length
      ? Math.round((store.todos.filter((t) => t.completed).length / store.todos.length) * 100)
      : 0,
  }), [store.todos]);

  return { ...store, filteredTodos, stats };
}
