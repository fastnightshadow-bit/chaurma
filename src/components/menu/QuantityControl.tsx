"use client";

import { Minus, Plus } from "lucide-react";
import styles from "../site.module.css";

interface QuantityControlProps {
  readonly quantity: number;
  readonly label: string;
  readonly onDecrease: () => void;
  readonly onIncrease: () => void;
}

export function QuantityControl({
  quantity,
  label,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className={styles.stepper} aria-label={`Количество: ${label}`}>
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`Уменьшить: ${label}`}
      >
        <Minus size={18} />
      </button>
      <output aria-live="polite">{quantity}</output>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`Увеличить: ${label}`}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
