import Image from "next/image";
import type { ReactNode } from "react";
import styles from "../site.module.css";

export function EmptyState({
  title,
  text,
  action,
}: Readonly<{ title: string; text: string; action?: ReactNode }>) {
  return (
    <div className={styles.emptyState}>
      <Image
        className={styles.emptyStateIcon}
        src="/icons/icon.svg"
        alt=""
        width={64}
        height={64}
        unoptimized
      />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
