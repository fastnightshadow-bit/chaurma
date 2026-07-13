"use client";

import { menuCategories, menuItems } from "@/data/menu";
import { scrollToSection } from "@/utils/scrollToSection";
import { useCallback, useState } from "react";
import styles from "../site.module.css";
import { EmptyState } from "../ui/EmptyState";
import { Toast } from "../ui/Toast";
import { CategoryNavigation } from "./CategoryNavigation";
import { MenuItemCard } from "./MenuItemCard";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>(
    menuCategories[0].id,
  );
  const [toast, setToast] = useState<string | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const visibleItems = menuItems.filter(
    (item) => item.categoryId === activeCategory,
  );

  return (
    <section id="menu" className={styles.section} aria-labelledby="menu-title">
      <div className={styles.sectionHeading}>
        <span>Выберите блюда</span>
        <h2 id="menu-title">Меню</h2>
        <p>Меню доставки Яндекс Еды. На месте блюда и цены могут отличаться.</p>
      </div>
      <CategoryNavigation
        categories={menuCategories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />
      <div className={styles.menuList}>
        {visibleItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAdded={setToast} />
        ))}
        {visibleItems.length === 0 ? (
          <EmptyState
            title="В этой категории пока нет позиций"
            text="Выберите другую категорию меню."
          />
        ) : null}
      </div>
      {toast ? (
        <Toast
          message={`Добавлено: ${toast}`}
          onClose={closeToast}
          onOpenCart={() => {
            closeToast();
            scrollToSection("cart");
          }}
        />
      ) : null}
    </section>
  );
}
