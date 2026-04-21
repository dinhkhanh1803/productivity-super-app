"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card3D } from "@/components/ui/card-3d";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";
import { useRealTimeClock } from "@/hooks/useRealTimeClock";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: "event" | "task";
  location?: string;
  colorClass: string;
}

const todayScheduleData: ScheduleItem[] = [
  { id: "1", time: "09:00", title: "Team Standup",         type: "event", location: "Zoom",     colorClass: "bg-blue-500" },
  { id: "2", time: "10:30", title: "Design landing page",  type: "task",                        colorClass: "bg-[var(--primary)]" },
  { id: "3", time: "14:00", title: "Design Review",        type: "event", location: "Room A",   colorClass: "bg-purple-500" },
  { id: "4", time: "16:00", title: "Review financial Q2",  type: "task",                        colorClass: "bg-amber-500" },
  { id: "4", time: "16:00", title: "Review financial Q2",  type: "task",                        colorClass: "bg-amber-500" },
  { id: "4", time: "16:00", title: "Review financial Q2",  type: "task",                        colorClass: "bg-amber-500" },
];

const tomorrowScheduleData: ScheduleItem[] = [
  { id: "5", time: "09:30", title: "1:1 with Manager",     type: "event", location: "Zoom",          colorClass: "bg-blue-500" },
  { id: "6", time: "11:00", title: "Q2 Planning session",  type: "event", location: "Conference B",   colorClass: "bg-orange-500" },
  { id: "7", time: "15:00", title: "Set up CI/CD pipeline", type: "task",                             colorClass: "bg-[var(--primary)]" },
];

/* Day names for both languages */
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const VI_DAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

function ScheduleCard({
  title,
  items,
  delay,
  isEmpty,
  emptyMsg,
}: {
  title: string;
  items: ScheduleItem[];
  delay: number;
  isEmpty: boolean;
  emptyMsg: string;
}) {
  const { t } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="h-full"
    >
      <Card3D className="h-full">
        <Card className="flex h-full flex-col rounded-2xl shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-3">
            <CardTitle className="min-w-0 text-lg font-bold leading-snug">{title}</CardTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/10"
            >
              <Link href="/calendar">
                {t("schedule.viewDetails")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col pb-4">
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
                <span className="text-3xl">{emptyMsg.includes("free") || emptyMsg.includes("rảnh") ? "🌿" : "🌟"}</span>
                <p className="text-base font-medium text-[var(--muted-foreground)]">{emptyMsg}</p>
              </div>
            ) : (
              <div className="max-h-[25rem] space-y-2 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex min-h-[4.5rem] items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-[var(--muted)]"
                  >
                    <div className="flex flex-col items-center pt-1 shrink-0 gap-0.5">
                      <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.colorClass}`} />
                      {items.indexOf(item) < items.length - 1 && (
                        <span className="w-px flex-1 bg-[var(--border)] min-h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 -mt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-semibold leading-snug text-[var(--foreground)]">
                          {item.title}
                        </p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                            item.type === "event"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                              : "bg-[var(--primary)]/15 text-[var(--primary)]"
                          )}
                        >
                          {t(`schedule.${item.type}`)}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                          <Clock className="h-3.5 w-3.5" />
                          {item.time}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Card3D>
    </motion.div>
  );
}

/* Needed for cn in this file */
function cn(...args: (string | boolean | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}

export function ScheduleSection() {
  const { t, lang } = useT();
  useRealTimeClock();

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const DAYS = lang === "vi" ? VI_DAYS : EN_DAYS;
  const todayName = DAYS[now.getDay()];
  const tomorrowName = DAYS[tomorrow.getDay()];

  const todayTitle = `${t("schedule.today")} (${todayName})`;
  const tomorrowTitle = `${t("schedule.tomorrow")} (${tomorrowName})`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ScheduleCard
        title={todayTitle}
        items={todayScheduleData}
        isEmpty={todayScheduleData.length === 0}
        emptyMsg={t("schedule.freeToday")}
        delay={0.06}
      />
      <ScheduleCard
        title={tomorrowTitle}
        items={tomorrowScheduleData}
        isEmpty={tomorrowScheduleData.length === 0}
        emptyMsg={t("schedule.freeTomorrow")}
        delay={0.12}
      />
    </div>
  );
}
