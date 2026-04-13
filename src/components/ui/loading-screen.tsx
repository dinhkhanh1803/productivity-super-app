"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface LoadingScreenProps {
  isVisible: boolean;
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--background)]"
          aria-label="Loading"
          role="status"
        >
          {/* Animated logo ring */}
          <div className="relative flex items-center justify-center">
            {/* Outer spinning ring */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="absolute h-16 w-16 rounded-full border-4 border-transparent border-t-[var(--primary)] border-r-[var(--primary)]/40"
            />

            {/* Inner pulsing logo */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-lg"
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
          </div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5 text-sm font-medium text-[var(--muted-foreground)] tracking-wide"
          >
            Loading…
          </motion.p>

          {/* Dot trail */}
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
