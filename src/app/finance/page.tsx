"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Sparkles,
} from "lucide-react";
import { addMonths, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceStore } from "@/store/financeStore";
import { useT } from "@/hooks/useT";
import { AddTransactionModal } from "@/features/finance/components/AddTransactionModal";
import { FinanceCalendarView } from "@/features/finance/components/FinanceCalendarView";
import { FinanceListView } from "@/features/finance/components/FinanceListView";
import { FinanceSummary } from "@/features/finance/components/FinanceSummary";
import { SavingsGoals } from "@/features/finance/components/SavingsGoals";

const FinanceCharts = dynamic(
  () => import("@/features/finance/components/FinanceCharts").then((module) => module.FinanceCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--muted)]/60"
          />
        ))}
      </div>
    ),
  }
);

function shiftMonth(monthKey: string, amount: number) {
  return format(addMonths(new Date(`${monthKey}-01T00:00:00`), amount), "yyyy-MM");
}

function formatMonthLabel(monthKey: string, monthLabel: string) {
  const [year, month] = monthKey.split("-");
  return `${monthLabel} ${Number(month)}/${year}`;
}

export default function FinancePage() {
  const selectedMonth = useFinanceStore((state) => state.selectedMonth);
  const setSelectedMonth = useFinanceStore((state) => state.setSelectedMonth);
  const { t } = useT();
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("finance.title")}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("finance.subtitle")}
            </p>
          </div>

          <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
            <div className="flex h-11 min-w-[200px] shrink-0 items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-2 shadow-sm">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
                aria-label={t("finance.previousMonth")}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm font-bold tabular-nums text-[var(--foreground)]">
                {formatMonthLabel(selectedMonth, t("finance.monthLabel"))}
              </span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                onClick={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
                aria-label={t("finance.nextMonth")}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <TabsList className="h-11 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-sm">
              <TabsTrigger value="overview" className="h-9 w-10 rounded-xl px-0" aria-label={t("finance.overview")}>
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="calendar" className="h-9 w-10 rounded-xl px-0" aria-label={t("finance.calendarView")}>
                <CalendarDays className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="h-9 w-10 rounded-xl px-0" aria-label={t("finance.listView")}>
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <Button
              variant={activeTab === "overview" ? "secondary" : "outline"}
              className="h-11 shrink-0 rounded-2xl px-4 text-sm font-bold shadow-sm whitespace-nowrap"
              onClick={() => setActiveTab("overview")}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              {t("finance.analytics")}
            </Button>

            <Button className="h-11 shrink-0 rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 whitespace-nowrap" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              {t("finance.addNew")}
            </Button>
          </div>
        </div>

        <FinanceSummary monthKey={selectedMonth} />

        <TabsContent value="overview" className="space-y-4">
          <FinanceCharts monthKey={selectedMonth} />
          <SavingsGoals monthKey={selectedMonth} />
        </TabsContent>
        <TabsContent value="calendar">
          <FinanceCalendarView monthKey={selectedMonth} />
        </TabsContent>
        <TabsContent value="list">
          <FinanceListView monthKey={selectedMonth} />
        </TabsContent>
      </Tabs>

      <AddTransactionModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
