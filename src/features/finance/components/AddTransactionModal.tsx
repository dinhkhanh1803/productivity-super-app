"use client";

import { useMemo, useState } from "react";
import { CalculatorIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore } from "@/store/financeStore";
import type { TransactionType } from "@/types";
import { useT } from "@/hooks/useT";
import { Calculator } from "./Calculator";
import { useCurrencyFormatter } from "./useCurrencyFormatter";
import { translateCategory } from "./financeHelpers";

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  type: "expense" as TransactionType,
  amount: "",
  category: "Food",
  customCategory: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

export function AddTransactionModal({ open, onOpenChange }: AddTransactionModalProps) {
  const { addTransaction, addCategory, incomeCategories, expenseCategories } = useFinanceStore();
  const { t } = useT();
  const { currency } = useCurrencyFormatter();
  const [form, setForm] = useState(initialForm);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = useMemo(
    () => (showCustomCategory ? form.customCategory.trim() : form.category),
    [form.category, form.customCategory, showCustomCategory]
  );
  const safeIncomeCategories = incomeCategories?.length ? incomeCategories : ["Salary"];
  const safeExpenseCategories = expenseCategories?.length ? expenseCategories : ["Food"];
  const categoryOptions = form.type === "income" ? safeIncomeCategories : safeExpenseCategories;
  const amountPreview = Number(form.amount) > 0 ? Number(form.amount).toLocaleString("en-US") : "";

  function reset() {
    setForm({ ...initialForm, date: new Date().toISOString().split("T")[0] });
    setShowCustomCategory(false);
    setShowCalculator(false);
    setError("");
  }

  function save() {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setError(t("finance.amountValidation"));
      return;
    }
    if (!selectedCategory) {
      setError(t("finance.categoryValidation"));
      return;
    }
    if (!form.date) {
      setError(t("finance.dateValidation"));
      return;
    }

    if (showCustomCategory) addCategory(selectedCategory, form.type);
    addTransaction({
      type: form.type,
      amount,
      category: selectedCategory,
      date: new Date(`${form.date}T12:00:00`).toISOString(),
      note: form.note.trim(),
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("finance.addTransaction")}</DialogTitle>
          <DialogDescription>
            {t("finance.addTransactionDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--muted)] p-1">
            {(["expense", "income"] as TransactionType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    type,
                    category: type === "income" ? safeIncomeCategories[0] : safeExpenseCategories[0],
                  }));
                  setShowCustomCategory(false);
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                  form.type === type
                    ? type === "income"
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-red-500 text-white shadow-sm"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--card)]"
                }`}
              >
                {t(`finance.${type}`)}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Input
              label={t("finance.amount")}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              leftIcon={<span className="text-xs font-bold">{currency}</span>}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowCalculator((current) => !current)}
                  className="rounded-md p-0.5 hover:bg-[var(--muted)]"
                  aria-label="Open calculator"
                >
                  <CalculatorIcon className="h-4 w-4" />
                </button>
              }
            />
            {amountPreview && (
              <p className="text-xs text-[var(--muted-foreground)]">
                {t("finance.formattedAmount")}:{" "}
                <span className="font-semibold text-[var(--foreground)]">{amountPreview}</span>
              </p>
            )}
            {showCalculator && (
              <Calculator
                onApply={(value) => {
                  setForm((current) => ({ ...current, amount: String(value) }));
                  setShowCalculator(false);
                }}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("finance.category")}</Label>
            {!showCustomCategory ? (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Select
                  value={form.category}
                  onValueChange={(category) => setForm((current) => ({ ...current, category }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {translateCategory(category, t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowCustomCategory(true)}
                >
                  <Plus className="h-4 w-4" />
                  {t("finance.addNewCategory")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  placeholder={t("finance.customCategory")}
                  value={form.customCategory}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, customCategory: event.target.value }))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowCustomCategory(false)}
                >
                  {t("finance.usePreset")}
                </Button>
              </div>
            )}
          </div>

          <Input
            label={t("finance.date")}
            type="date"
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
          />
          <Input
            label={t("finance.note")}
            placeholder={t("finance.optionalDetails")}
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          />
          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("finance.cancel")}
          </Button>
          <Button onClick={save}>{t("finance.saveTransaction")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
