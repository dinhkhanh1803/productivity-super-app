import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "VND" || currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "VND" || currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function getCurrencyLocale(currency: string): string {
  if (currency === "VND") return "vi-VN";
  if (currency === "EUR") return "de-DE";
  if (currency === "JPY") return "ja-JP";
  return "en-US";
}

export function formatCompactCurrencyValue(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_000_000_000) return `${sign}${trimCompact(abs / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `${sign}${trimCompact(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}${trimCompact(abs / 1_000)}K`;
  return `${amount}`;
}

function trimCompact(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}…` : str;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const k = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
