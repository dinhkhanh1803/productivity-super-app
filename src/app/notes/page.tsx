"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pin,
  Tag,
  Trash2,
  Hash,
  FileText,
  Bold,
  Italic,
} from "lucide-react";
import { formatRelativeDate, cn } from "@/lib/utils";
import { useNotesStore } from "@/store/notesStore";
import type { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotesPage() {
  const {
    notes,
    activeNoteId,
    searchQuery,
    selectedTag,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setActiveNote,
    setSearchQuery,
    setSelectedTag,
    getAllTags,
  } = useNotesStore();

  const activeNote = notes.find((n) => n.id === activeNoteId) ?? null;
  const allTags = getAllTags();

  const [localTitle, setLocalTitle] = useState(activeNote?.title ?? "");
  const [localContent, setLocalContent] = useState(activeNote?.content ?? "");
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when active note changes
  useEffect(() => {
    setLocalTitle(activeNote?.title ?? "");
    setLocalContent(activeNote?.content ?? "");
  }, [activeNoteId, activeNote?.title, activeNote?.content]);

  function handleTitleChange(val: string) {
    setLocalTitle(val);
    if (!activeNoteId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      updateNote(activeNoteId, { title: val });
    }, 500);
  }

  function handleContentChange(val: string) {
    setLocalContent(val);
    if (!activeNoteId) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      updateNote(activeNoteId, { content: val });
    }, 500);
  }

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const pinned = filteredNotes.filter((n) => n.pinned);
  const unpinned = filteredNotes.filter((n) => !n.pinned);

  const noteColors = [
    "#5b6ef5", "#8b5cf6", "#ec4899", "#ef4444",
    "#f59e0b", "#10b981", "#06b6d4", "#64748b",
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)]">
        {/* Search + Add */}
        <div className="p-3 space-y-2 border-b border-[var(--border)]">
          <div className="flex gap-1.5">
            <Input
              placeholder="Search notes..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs"
              id="notes-search"
            />
            <Button size="icon-sm" onClick={addNote} id="add-note-btn">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Tags filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full transition-colors",
                  !selectedTag
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                )}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full transition-colors",
                    selectedTag === tag
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                  )}
                >
                  <Hash className="h-2.5 w-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-8 w-8 text-[var(--muted-foreground)] opacity-40 mb-2" />
              <p className="text-xs text-[var(--muted-foreground)]">
                {searchQuery ? "No matching notes" : "No notes yet"}
              </p>
              <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={addNote}>
                Create note
              </Button>
            </div>
          ) : (
            <>
              {pinned.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-2 py-1.5">
                    Pinned
                  </p>
                  {pinned.map((note) => (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      isActive={note.id === activeNoteId}
                      onSelect={() => setActiveNote(note.id)}
                      onPin={() => togglePin(note.id)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              )}
              {unpinned.length > 0 && (
                <div>
                  {pinned.length > 0 && (
                    <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-2 py-1.5 mt-2">
                      Notes
                    </p>
                  )}
                  {unpinned.map((note) => (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      isActive={note.id === activeNoteId}
                      onSelect={() => setActiveNote(note.id)}
                      onPin={() => togglePin(note.id)}
                      onDelete={() => deleteNote(note.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeNote ? (
          <motion.div
            key={activeNote.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Note toolbar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-1">
                {noteColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateNote(activeNote.id, { color })}
                    className={cn(
                      "h-4 w-4 rounded-full transition-transform hover:scale-125",
                      activeNote.color === color && "ring-2 ring-offset-1 ring-[var(--ring)] scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="h-4 w-px bg-[var(--border)] mx-1" />
              <span className="text-xs text-[var(--muted-foreground)]">
                Edited {formatRelativeDate(activeNote.updatedAt)}
              </span>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => togglePin(activeNote.id)}
                className={cn(activeNote.pinned && "text-[var(--primary)]")}
                id="note-pin-btn"
              >
                <Pin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => { deleteNote(activeNote.id); }}
                className="text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                id="note-delete-btn"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Title */}
            <div className="px-8 pt-6">
              <input
                value={localTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Note"
                className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
                id="note-title-input"
              />
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {activeNote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs text-[var(--primary)] bg-[var(--primary)]/10 rounded-full px-2 py-0.5 cursor-pointer hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors"
                    onClick={() =>
                      updateNote(activeNote.id, {
                        tags: activeNote.tags.filter((t) => t !== tag),
                      })
                    }
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag} ×
                  </span>
                ))}
                <TagAdder
                  onAdd={(tag) => {
                    if (!activeNote.tags.includes(tag)) {
                      updateNote(activeNote.id, { tags: [...activeNote.tags, tag] });
                    }
                  }}
                />
              </div>
              <div className="border-b border-[var(--border)] mt-4" />
            </div>

            {/* Content */}
            <textarea
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start writing... (supports markdown)"
              className="flex-1 resize-none bg-transparent px-8 py-4 text-sm outline-none placeholder:text-[var(--muted-foreground)] leading-relaxed font-mono"
              id="note-content-input"
            />
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center">
              <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">No note selected</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Select a note from the list or create a new one
              </p>
            </div>
            <Button onClick={addNote} id="create-first-note-btn">
              <Plus className="h-4 w-4" /> Create Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoteListItem({
  note,
  isActive,
  onSelect,
  onPin,
  onDelete,
}: {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "group relative rounded-lg p-2.5 cursor-pointer transition-all duration-150",
        isActive
          ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30"
          : "hover:bg-[var(--sidebar-accent)]"
      )}
      onClick={onSelect}
    >
      {/* Color dot */}
      {note.color && (
        <span
          className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: note.color }}
        />
      )}
      <div className="flex items-start gap-2 pr-3">
        {note.pinned && <Pin className="h-3 w-3 text-[var(--primary)] shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{note.title || "Untitled"}</p>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
            {note.content.replace(/[#*\[\]`]/g, "").slice(0, 80) || "No content"}
          </p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5">
            {formatRelativeDate(note.updatedAt)}
          </p>
        </div>
      </div>
      {/* Actions on hover */}
      <div className="absolute right-1 top-1 hidden group-hover:flex gap-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          className={cn("rounded p-1 hover:bg-[var(--muted)] transition-colors", note.pinned && "text-[var(--primary)]")}
        >
          <Pin className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="rounded p-1 hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

function TagAdder({ onAdd }: { onAdd: (tag: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  function submit() {
    const tag = value.trim().toLowerCase();
    if (tag) onAdd(tag);
    setValue("");
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Add tag..."
        className="text-xs bg-[var(--muted)] rounded-full px-2 py-0.5 outline-none border border-[var(--border)] w-20"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-0.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      id="add-tag-btn"
    >
      <Plus className="h-3 w-3" /> tag
    </button>
  );
}
