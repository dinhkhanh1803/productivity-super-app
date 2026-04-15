"use client";

import { useFocusStore } from "@/store/focusStore";
import { motion, AnimatePresence } from "framer-motion";

export function BackgroundRenderer() {
  const { background } = useFocusStore();

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden bg-[var(--background)] pointer-events-none rounded-xl">
      <AnimatePresence mode="wait">
        {background.type === "color" && (
          <motion.div
            key="color"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{ background: background.url }}
          />
        )}
        
        {background.type === "image" && (
          <motion.img
            key={background.url}
            src={background.url}
            alt="Focus Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: background.opacity ?? 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {background.type === "video" && (
          <motion.video
            key={background.url}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: background.opacity ?? 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={background.url} type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>

      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
    </div>
  );
}
