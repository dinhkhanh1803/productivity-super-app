"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Flag,
  Calendar,
  Tag,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { useTodoStore } from "@/store/todoStore";
import type { Todo, TodoPriority, TodoStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const priorityConfig: Record<TodoPriority, { label: string; color: string; dot: string }> = {
  high: { label: "High", color: "destructive", dot: "bg-red-500" },
  medium: { label: "Medium", color: "warning", dot: "bg-amber-500" },
  low: { label: "Low", color: "secondary", dot: "bg-slate-400" },
};

const defaultForm: Omit<Todo, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: undefined,
  tags: [],
  completed: false,
};

export default function TodoPage() {
  const {
    todos,
    filter,
    setFilter,
    toggleTodo,
    deleteTodo,
    addTodo,
    updateTodo,
    searchQuery,
    setSearchQuery,
    clearCompleted,
  } = useTodoStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [tagInput, setTagInput] = useState("");

  const filtered = todos.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "todo" && !t.completed) ||
      (filter === "done" && t.completed) ||
      t.status === filter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pending = todos.filter((t) => !t.completed).length;
  const done = todos.filter((t) => t.completed).length;

  function openAdd() {
    setForm(defaultForm);
    setTagInput("");
    setEditingTodo(null);
    setIsAddOpen(true);
  }

  function openEdit(todo: Todo) {
    setForm({
      title: todo.title,
      description: todo.description ?? "",
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.dueDate,
      tags: todo.tags,
      completed: todo.completed,
    });
    setTagInput("");
    setEditingTodo(todo);
    setIsAddOpen(true);
  }

  function handleSubmit() {
    if (!form.title.trim()) return;
    if (editingTodo) {
      updateTodo(editingTodo.id, form);
    } else {
      addTodo(form);
    }
    setIsAddOpen(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Tasks</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {pending} pending · {done} completed
          </p>
        </div>
        <div className="flex gap-2">
          {done > 0 && (
            <Button variant="outline" size="sm" onClick={clearCompleted} className="text-[var(--muted-foreground)]">
              Clear done
            </Button>
          )}
          <Button onClick={openAdd} id="add-todo-btn">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search tasks..."
        leftIcon={<Search className="h-4 w-4" />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        id="todo-search"
      />

      {/* Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as TodoStatus | "all")}>
        <TabsList>
          <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
          <TabsTrigger value="todo">Active ({pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Done ({done})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-10 w-10 text-[var(--muted-foreground)] mb-3 opacity-50" />
                <p className="text-[var(--muted-foreground)]">
                  {searchQuery ? "No tasks match your search" : "No tasks here yet"}
                </p>
                {!searchQuery && (
                  <Button variant="outline" size="sm" className="mt-3" onClick={openAdd}>
                    Add your first task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {filtered.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => toggleTodo(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onEdit={() => openEdit(todo)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTodo ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              id="todo-title-input"
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] placeholder:text-[var(--muted-foreground)]"
                rows={3}
                placeholder="Optional description..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priority: e.target.value as TodoPriority }))
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full rounded-lg border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as TodoStatus }))
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <Input
              label="Due Date"
              type="date"
              value={form.dueDate ? form.dueDate.split("T")[0] : ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                }))
              }
              id="todo-due-date"
            />

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  id="todo-tag-input"
                />
                <Button variant="outline" size="sm" onClick={addTag} type="button">
                  Add
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] text-xs px-2.5 py-0.5 cursor-pointer hover:bg-[var(--destructive)]/15 hover:text-[var(--destructive)] transition-colors"
                      onClick={() =>
                        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
                      }
                    >
                      #{tag} ×
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!form.title.trim()}>
              {editingTodo ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { label, dot } = priorityConfig[todo.priority];
  const statusColors: Record<TodoStatus, string> = {
    todo: "text-[var(--muted-foreground)]",
    in_progress: "text-[var(--primary)]",
    done: "text-emerald-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group transition-all duration-200 hover:shadow-md",
          todo.completed && "opacity-60"
        )}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={onToggle}
              className="mt-0.5 shrink-0 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
              id={`todo-toggle-${todo.id}`}
            >
              {todo.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-sm font-medium",
                    todo.completed && "line-through text-[var(--muted-foreground)]"
                  )}
                >
                  {todo.title}
                </span>
                <span className={cn("flex items-center gap-1 text-xs", statusColors[todo.status])}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
                  {todo.status.replace("_", " ")}
                </span>
              </div>
              {todo.description && (
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1">
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap mt-1.5">
                {todo.dueDate && (
                  <span className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(todo.dueDate), "MMM d")}
                  </span>
                )}
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-0.5 text-[10px] text-[var(--primary)] bg-[var(--primary)]/10 rounded-full px-1.5 py-0.5"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Priority + Delete */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant={priorityConfig[todo.priority].color as "destructive" | "warning" | "secondary"}
                size="sm"
              >
                <Flag className="h-2.5 w-2.5 mr-0.5" />
                {label}
              </Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-all"
                id={`todo-delete-${todo.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
