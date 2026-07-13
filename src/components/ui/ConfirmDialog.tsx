"use client";

import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import styles from "../site.module.css";

interface ConfirmDialogProps {
  readonly title: string;
  readonly description?: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly onPrimary: () => void;
  readonly onSecondary: () => void;
  readonly destructive?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  destructive = false,
}: ConfirmDialogProps) {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  useFocusTrap(dialogRef);
  useEffect(() => primaryRef.current?.focus(), []);

  return (
    <div className={styles.dialogBackdrop}>
      <section
        ref={dialogRef}
        className={styles.confirmDialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-description" : undefined}
      >
        <h2 id="confirm-title">{title}</h2>
        {description ? <p id="confirm-description">{description}</p> : null}
        <div className={styles.dialogActions}>
          <button
            ref={primaryRef}
            type="button"
            className={
              destructive ? styles.destructiveButton : styles.primaryButton
            }
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onSecondary}
          >
            {secondaryLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
