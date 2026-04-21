"use client";

import { useState } from "react";
import { Calculator as CalculatorIcon, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/hooks/useT";

interface CalculatorProps {
  onApply: (value: number) => void;
}

const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];

function compute(left: number, right: number, operator: string) {
  if (operator === "+") return left + right;
  if (operator === "-") return left - right;
  if (operator === "*") return left * right;
  if (operator === "/") return right === 0 ? left : left / right;
  return right;
}

export function Calculator({ onApply }: CalculatorProps) {
  const { t } = useT();
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);

  const value = Number(display) || 0;

  function press(key: string) {
    if (["+", "-", "*", "/"].includes(key)) {
      if (stored !== null && operator) {
        const result = compute(stored, value, operator);
        setStored(result);
        setDisplay(String(Number(result.toFixed(2))));
      } else {
        setStored(value);
      }
      setOperator(key);
      setFresh(true);
      return;
    }

    if (key === "=") {
      if (stored !== null && operator) {
        const result = compute(stored, value, operator);
        setDisplay(String(Number(result.toFixed(2))));
        setStored(null);
        setOperator(null);
        setFresh(true);
      }
      return;
    }

    if (key === "." && display.includes(".") && !fresh) return;
    setDisplay(fresh || display === "0" ? key : `${display}${key}`);
    setFresh(false);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalculatorIcon className="h-4 w-4 text-[var(--primary)]" />
          {t("finance.calculator")}
        </div>
        <div className="min-w-0 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-right font-mono text-lg font-semibold tabular-nums">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <Button
            key={key}
            type="button"
            variant={["+", "-", "*", "/", "="].includes(key) ? "secondary" : "outline"}
            className="h-9 rounded-xl"
            onClick={() => press(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            setDisplay("0");
            setStored(null);
            setOperator(null);
          }}
        >
          <Delete className="h-4 w-4" />
          {t("finance.clear")}
        </Button>
        <Button type="button" className="rounded-xl" onClick={() => onApply(value)}>
          {t("finance.apply")}
        </Button>
      </div>
    </div>
  );
}
