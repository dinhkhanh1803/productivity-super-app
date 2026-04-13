"use client";

import { useEffect, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";

/**
 * Registers global keyboard shortcuts for the app.
 * Place this hook in the root layout or a global provider.
 */
export function useKeyboardShortcuts() {
  const { toggleCommandPalette, toggleSidebarCollapsed } = useUIStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd + K → Command palette
      if (ctrl && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }

      // Ctrl/Cmd + B → Toggle sidebar
      if (ctrl && e.key === "b") {
        e.preventDefault();
        toggleSidebarCollapsed();
      }
    },
    [toggleCommandPalette, toggleSidebarCollapsed]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
