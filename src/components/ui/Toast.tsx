"use client";

import { ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import styles from "../site.module.css";

interface ToastProps {
  readonly message: string;
  readonly onClose: () => void;
  readonly onOpenCart: () => void;
}

export function Toast({ message, onClose, onOpenCart }: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 2500);
    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <ShoppingBag size={20} aria-hidden="true" />
      <span>{message}</span>
      <button type="button" className={styles.toastAction} onClick={onOpenCart}>
        В корзину
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={onClose}
        aria-label="Закрыть уведомление"
      >
        <X size={18} />
      </button>
    </div>
  );
}
