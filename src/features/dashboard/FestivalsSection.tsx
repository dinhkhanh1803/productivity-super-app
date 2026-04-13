"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/hooks/useT";

interface Festival {
  id: string;
  name: string;
  nameVi: string;
  date: string;
  daysUntil: number;
  emoji: string;
  country: string;
}

const festivals: Festival[] = [
  { id: "1", name: "Good Friday",  nameVi: "Thứ Sáu Tuần Thánh", date: "18/04/2026", daysUntil: 5,   emoji: "✝️",  country: "Global" },
  { id: "2", name: "Easter Sunday", nameVi: "Chủ Nhật Phục Sinh", date: "20/04/2026", daysUntil: 7,   emoji: "🐣",  country: "Global" },
  { id: "3", name: "Labour Day",   nameVi: "Ngày Quốc tế Lao động", date: "01/05/2026", daysUntil: 18,  emoji: "⚒️",  country: "Global" },
  { id: "4", name: "Vesak Day",    nameVi: "Ngày Phật Đản",  date: "24/05/2026", daysUntil: 41,  emoji: "🪷",  country: "SEA" },
  { id: "5", name: "Eid al-Adha",  nameVi: "Lễ Eid al-Adha", date: "06/06/2026", daysUntil: 54,  emoji: "🌙",  country: "Global" },
  { id: "6", name: "National Day", nameVi: "Ngày Quốc khánh", date: "02/09/2026", daysUntil: 142, emoji: "🇻🇳", country: "Vietnam" },
];

function urgencyClass(days: number): string {
  if (days <= 7)  return "text-red-500 bg-red-500/10";
  if (days <= 30) return "text-amber-500 bg-amber-500/10";
  return "text-[var(--primary)] bg-[var(--primary)]/10";
}

export function FestivalsSection() {
  const { t, lang } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38, duration: 0.35 }}
    >
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/15">
              <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <CardTitle className="text-sm">{t("dashboard.festivals")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {festivals.map((fest, i) => (
              <motion.div
                key={fest.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.42 + i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-3 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all duration-200 cursor-default"
              >
                <span className="text-2xl shrink-0 leading-none mt-0.5">{fest.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                    {lang === "vi" ? fest.nameVi : fest.name}
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{fest.date}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`rounded-full px-2 py-px text-[10px] font-semibold ${urgencyClass(fest.daysUntil)}`}>
                      {fest.daysUntil === 0
                        ? "Today! 🎉"
                        : fest.daysUntil === 1
                        ? lang === "vi" ? "Ngày mai" : "Tomorrow"
                        : lang === "vi"
                        ? `${fest.daysUntil} ngày`
                        : `${fest.daysUntil} days`}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">{fest.country}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
