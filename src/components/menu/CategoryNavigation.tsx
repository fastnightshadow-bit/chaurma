"use client";

import type { MenuCategory } from "@/types/menu";
import styles from "../site.module.css";

export function CategoryNavigation({
  categories,
  activeId,
  onChange,
}: Readonly<{
  categories: readonly MenuCategory[];
  activeId: string;
  onChange: (id: string) => void;
}>) {
  return (
    <div
      className={styles.categoryNav}
      role="tablist"
      aria-label="Категории меню"
    >
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={activeId === category.id}
          className={activeId === category.id ? styles.categoryActive : ""}
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
