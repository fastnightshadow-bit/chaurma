"use client";

import { Trash2 } from "lucide-react";
import styles from "../site.module.css";

export function ClearCartButton({
  onClick,
}: Readonly<{ onClick: () => void }>) {
  return (
    <button type="button" className={styles.textButton} onClick={onClick}>
      <Trash2 size={17} /> Очистить корзину
    </button>
  );
}
