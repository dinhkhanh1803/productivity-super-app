import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";
import type { Note } from "@/types";

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedTag: string | null;

  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedTag: (tag: string | null) => void;
  getAllTags: () => string[];
}

const now = () => new Date().toISOString();

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: generateId(),
          title: "Welcome to Notes 📝",
          content:
            "Start capturing your thoughts, ideas, and knowledge here. You can use **markdown** to format your notes.\n\n## Features\n- Pin important notes\n- Tag for organization\n- Full-text search\n- Rich text editing",
          tags: ["welcome", "getting-started"],
          pinned: true,
          color: "#5b6ef5",
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Project Ideas 💡",
          content:
            "## App Ideas\n\n1. **Habit Tracker** — Daily streaks and analytics\n2. **Budget Planner** — Monthly expense categorization\n3. **Learning Journal** — Track courses and notes\n\n## Side Projects\n- Open-source CLI tool for productivity\n- Chrome extension for focus mode",
          tags: ["ideas", "projects"],
          pinned: false,
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: generateId(),
          title: "Meeting Notes — Q2 Planning",
          content:
            "**Date:** April 10, 2026\n**Attendees:** Alice, Bob, Carol\n\n## Action Items\n- [ ] Finalize roadmap by April 20\n- [ ] Set up staging environment\n- [ ] Review design mockups with team\n\n## Key Decisions\n- Launch date: June 1\n- MVP scope reduced to core features",
          tags: ["meeting", "work"],
          pinned: false,
          createdAt: now(),
          updatedAt: now(),
        },
      ],
      activeNoteId: null,
      searchQuery: "",
      selectedTag: null,

      addNote: () => {
        const id = generateId();
        set((state) => ({
          notes: [
            {
              id,
              title: "Untitled Note",
              content: "",
              tags: [],
              pinned: false,
              createdAt: now(),
              updatedAt: now(),
            },
            ...state.notes,
          ],
          activeNoteId: id,
        }));
      },

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: now() } : n
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        })),

      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned, updatedAt: now() } : n
          ),
        })),

      setActiveNote: (id) => set({ activeNoteId: id }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedTag: (selectedTag) => set({ selectedTag }),

      getAllTags: () => {
        const tags = get().notes.flatMap((n) => n.tags);
        return [...new Set(tags)].sort();
      },
    }),
    { name: "psa-notes" }
  )
);
