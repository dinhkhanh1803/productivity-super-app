"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, Sparkles } from "lucide-react";
import { useT } from "@/hooks/useT";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ─── Mock AI responses ─────────────────────────────────── */
const mockResponses: Record<string, string[]> = {
  task: [
    "Breaking tasks into smaller steps makes them easier to tackle. Try the 2-minute rule: if a task takes under 2 minutes, do it immediately!",
    "I can see you have some high-priority tasks pending. Would you like tips on how to prioritize effectively using the Eisenhower Matrix?",
  ],
  focus: [
    "The Pomodoro Technique works great! Try 25-minute focus blocks followed by a 5-minute break. After 4 sessions, take a longer 15-30 minute break.",
    "For deep work, eliminate distractions first — close unnecessary tabs, silence notifications, and set a clear intention for what you'll accomplish.",
  ],
  schedule: [
    "Time-blocking your calendar can dramatically improve productivity. Schedule your most important work during your peak energy hours.",
    "I notice you have events scheduled. Would you like suggestions on how to prepare for your upcoming meetings?",
  ],
  finance: [
    "The 50/30/20 rule is a great budgeting guideline: 50% for needs, 30% for wants, and 20% for savings. How does your current spending compare?",
    "Tracking every expense, no matter how small, can reveal surprising spending patterns. Small daily expenses often add up significantly over a month.",
  ],
  note: [
    "The Zettelkasten method can transform how you take notes — create atomic notes with unique IDs and link related ideas to build a personal knowledge base.",
    "For better note retention, try the Feynman Technique: explain the concept in simple terms as if teaching someone else.",
  ],
  hello: [
    "Hello! 👋 I'm here to help you with your productivity. You can ask me about tasks, focus sessions, scheduling, finance tips, or anything else on your mind!",
  ],
  help: [
    "Here's what I can help you with:\n• 📋 **Task management** — prioritization, organization\n• ⏱️ **Focus sessions** — Pomodoro, deep work tips\n• 📅 **Scheduling** — time-blocking, meeting prep\n• 💰 **Finance** — budgeting, expense tracking\n• 📝 **Note-taking** — methods, organization\n\nJust ask!",
  ],
};

const fallbackResponses = [
  "That's a great question! While I'm still learning, I'd suggest breaking this down into smaller, manageable steps. What's the most important aspect you'd like to focus on first?",
  "I appreciate you sharing that. Productivity often comes down to clarity — being clear about what you want to achieve and why. Can you tell me more about your goal?",
  "Great thinking! Remember, consistency beats intensity. Small, regular actions lead to remarkable long-term results. Would you like to explore any specific strategies?",
];

function getMockResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [keyword, responses] of Object.entries(mockResponses)) {
    if (lower.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

/* ─── Message bubble ─────────────────────────────────────── */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5",
          isUser
            ? "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]"
            : "bg-[var(--muted)] border border-[var(--border)]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-[var(--primary)]" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-[var(--primary)] text-white rounded-tr-sm"
            : "bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm"
        )}
      >
        {/* Render simple markdown bold */}
        <div
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br/>"),
          }}
        />
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isUser ? "text-white/60" : "text-[var(--muted-foreground)]"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Typing indicator ───────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] border border-[var(--border)]">
        <Bot className="h-4 w-4 text-[var(--primary)]" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Suggested prompts ──────────────────────────────────── */
const SUGGESTIONS = [
  "How can I improve my focus?",
  "Give me budgeting tips",
  "Help me prioritize my tasks",
  "Best note-taking strategies?",
];

/* ─── Main AI Page ───────────────────────────────────────── */
export default function AIPage() {
  const { t } = useT();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t("ai.welcome"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  async function sendMessage(text: string = input) {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setIsThinking(true);

    // Simulate AI thinking delay (1.2–2s)
    const delay = 1200 + Math.random() * 800;
    await new Promise((r) => setTimeout(r, delay));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(trimmed),
      timestamp: new Date(),
    };
    setIsThinking(false);
    setMessages((m) => [...m, aiMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow">
              <Sparkles className="h-4.5 w-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--foreground)]">{t("ai.title")}</h1>
              <p className="text-xs text-[var(--muted-foreground)]">{t("ai.subtitle")}</p>
            </div>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              onClick={() =>
                setMessages([
                  { id: "welcome", role: "assistant", content: t("ai.welcome"), timestamp: new Date() },
                ])
              }
              id="clear-chat-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("ai.clearChat")}
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isThinking && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (show only when few messages) */}
      {messages.length <= 2 && !isThinking && (
        <div className="shrink-0 px-4 sm:px-8 pb-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-sm px-4 py-4 sm:px-8">
        <div className="flex items-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 focus-within:border-[var(--primary)]/60 focus-within:ring-2 focus-within:ring-[var(--ring)]/20 transition-all shadow-sm">
          <textarea
            ref={inputRef}
            id="ai-input"
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("ai.placeholder")}
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)] leading-relaxed max-h-[120px]"
            disabled={isThinking}
          />
          <Button
            id="ai-send-btn"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-xl"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isThinking}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[var(--muted-foreground)]">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
