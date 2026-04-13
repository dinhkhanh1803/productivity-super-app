"use client";

import { useCallback } from "react";
import { useI18nStore } from "@/store/i18nStore";
import { translations, getNestedValue } from "@/lib/i18n/translations";

/**
 * Returns a `t(key)` function for the current language.
 * Key uses dot notation: t("sidebar.dashboard") → "Dashboard" | "Tổng quan"
 *
 * Any component that calls useT() will re-render automatically
 * when the user changes language.
 */
export function useT() {
  const lang = useI18nStore((s) => s.lang);
  const dict = translations[lang] as unknown as Record<string, unknown>;

  const t = useCallback(
    (key: string): string => getNestedValue(dict, key),
    [dict]
  );

  return { t, lang };
}
