"use client";

import { motion } from "framer-motion";
import { useRealTimeClock } from "@/hooks/useRealTimeClock";
import { useT } from "@/hooks/useT";

const USER_NAME = "John";

export function GreetingSection() {
  const clock = useRealTimeClock();
  const { t } = useT();

  const greetingKey =
    clock.hours < 12 ? "greeting.morning"
    : clock.hours < 17 ? "greeting.afternoon"
    : "greeting.evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-1"
    >
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t(greetingKey)},{" "}
        <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
          {USER_NAME} 👋
        </span>
      </h1>
      <p className="text-[var(--muted-foreground)] text-sm font-medium tracking-wide">
        {clock.dayOfWeek} &mdash; {clock.date}
      </p>
    </motion.div>
  );
}
