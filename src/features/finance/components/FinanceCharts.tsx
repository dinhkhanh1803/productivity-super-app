"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrencyValue } from "@/lib/utils";
import { useFinanceStore } from "@/store/financeStore";
import { useT } from "@/hooks/useT";
import { expenseColor, getRecentMonthKeys, incomeColor, translateCategory } from "./financeHelpers";
import { useCurrencyFormatter } from "./useCurrencyFormatter";

interface FinanceChartsProps {
  monthKey: string;
}

const pieColors = ["#ef4444", "#f97316", "#eab308", "#06b6d4", "#8b5cf6", "#ec4899", "#64748b"];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--card-foreground)",
  boxShadow: "0 16px 40px rgb(0 0 0 / 0.12)",
};

export function FinanceCharts({ monthKey }: FinanceChartsProps) {
  const getMonthlyData = useFinanceStore((state) => state.getMonthlyData);
  const { t } = useT();
  const { money, currency } = useCurrencyFormatter();
  const compactMoney = (value: number) => `${formatCompactCurrencyValue(value)} ${currency}`;
  const monthlyData = getMonthlyData(monthKey);
  const recentMonths = getRecentMonthKeys(monthKey);
  const trendData = recentMonths.map((key) => {
    const month = getMonthlyData(key);
    return {
      month: key.slice(5),
      income: month.totalIncome,
      expense: month.totalExpense,
      balance: month.totalIncome - month.totalExpense,
    };
  });

  const categoryData = Object.values(
    monthlyData.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce<Record<string, { name: string; value: number }>>((acc, transaction) => {
        acc[transaction.category] ??= { name: translateCategory(transaction.category, t), value: 0 };
        acc[transaction.category].value += transaction.amount;
        return acc;
      }, {})
  ).sort((a, b) => b.value - a.value);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>{t("finance.incomeVsExpense")}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={260}>
            <BarChart data={trendData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={72} tickLine={false} axisLine={false} tickFormatter={(value) => compactMoney(Number(value))} />
              <Tooltip formatter={(value) => money(Number(value))} contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="income" name={t("finance.income")} fill={incomeColor} radius={[8, 8, 0, 0]} animationDuration={900} />
              <Bar dataKey="expense" name={t("finance.expense")} fill={expenseColor} radius={[8, 8, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>{t("finance.expenseBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 min-w-0">
          {categoryData.length ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={105}
                  paddingAngle={3}
                  animationDuration={900}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => money(Number(value))} contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
              {t("finance.noExpenses")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>{t("finance.incomeTrend")}</CardTitle>
        </CardHeader>
        <CardContent className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={240}>
            <AreaChart data={trendData} margin={{ left: 8, right: 8 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={incomeColor} stopOpacity={0.34} />
                  <stop offset="95%" stopColor={incomeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={72} tickLine={false} axisLine={false} tickFormatter={(value) => compactMoney(Number(value))} />
              <Tooltip formatter={(value) => money(Number(value))} contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="income"
                stroke={incomeColor}
                fill="url(#incomeGradient)"
                strokeWidth={3}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>{t("finance.expenseTrend")}</CardTitle>
        </CardHeader>
        <CardContent className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={240}>
            <LineChart data={trendData} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis width={72} tickLine={false} axisLine={false} tickFormatter={(value) => compactMoney(Number(value))} />
              <Tooltip formatter={(value) => money(Number(value))} contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="expense"
                stroke={expenseColor}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
