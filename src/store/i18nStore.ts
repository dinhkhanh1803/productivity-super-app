import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/i18n/translations";

export type CurrencyCode = "VND" | "USD" | "EUR" | "JPY";

interface I18nState {
  lang: Language;
  currency: CurrencyCode;
  setLang: (lang: Language) => void;
  setCurrency: (currency: CurrencyCode) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: "en",
      currency: "VND",
      setLang: (lang) => set({ lang }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "psa-lang" }
  )
);
