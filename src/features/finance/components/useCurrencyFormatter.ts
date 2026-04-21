"use client";

import { useCallback } from "react";
import { getCurrencyLocale, formatCurrency } from "@/lib/utils";
import { useI18nStore } from "@/store/i18nStore";

export function useCurrencyFormatter() {
  const currency = useI18nStore((state) => state.currency);

  const money = useCallback(
    (amount: number) => formatCurrency(amount, currency, getCurrencyLocale(currency)),
    [currency]
  );

  return { currency, money };
}
