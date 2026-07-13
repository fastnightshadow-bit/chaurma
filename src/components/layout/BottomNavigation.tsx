"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { scrollToSection } from "@/utils/scrollToSection";
import { Home, MapPinned, ShoppingBag, Utensils } from "lucide-react";
import type { ComponentType } from "react";
import styles from "../site.module.css";

const items = [
  { id: "home", label: "Главная", icon: Home },
  { id: "menu", label: "Меню", icon: Utensils },
  { id: "cart", label: "Корзина", icon: ShoppingBag },
  { id: "route", label: "Маршрут", icon: MapPinned },
] as const;

export function BottomNavigation() {
  const { state } = useAppState();
  const count = state.cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <nav className={styles.bottomNav} aria-label="Основная навигация">
      {items.map(({ id, label, icon: Icon }) => (
        <NavItem
          key={id}
          icon={Icon}
          label={label}
          active={state.activeSection === id}
          badge={id === "cart" ? count : 0}
          onClick={() => scrollToSection(id)}
        />
      ))}
    </nav>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: Readonly<{
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  label: string;
  active: boolean;
  badge: number;
  onClick: () => void;
}>) {
  return (
    <button
      type="button"
      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.navIcon}>
        <Icon size={23} aria-hidden={true} />
        {badge > 0 ? (
          <b aria-live="polite" aria-label={`${badge} товаров`}>
            {badge > 99 ? "99+" : badge}
          </b>
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  );
}
