"use client";

import { menuItems } from "@/data/menu";
import { locations } from "@/data/locations";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { CartSnapshot } from "@/types/cart";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from "../site.module.css";

export function OrderPresentationModal({
  cart,
  onClose,
}: Readonly<{ cart: CartSnapshot; onClose: () => void }>) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef);
  const location =
    locations.find((entry) => entry.id === cart.locationId) ?? locations[0];
  const total = cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  useWakeLock(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.history.pushState({ orderPresentation: true }, "");
    const onPopState = () => onClose();
    window.addEventListener("popstate", onPopState);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("popstate", onPopState);
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      className={styles.presentation}
      role="dialog"
      aria-modal="true"
      aria-labelledby="presentation-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <header>
        <div>
          <span>Заказ для показа продавцу</span>
          <h2 id="presentation-title">Мой заказ</h2>
          <p>
            {location.name} · {location.address}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Закрыть заказ"
        >
          <X size={28} />
        </button>
      </header>
      <div className={styles.presentationList}>
        {cart.items.map((item) => {
          const menuItem = menuItems.find(
            (entry) => entry.id === item.menuItemId,
          );
          return (
            <article key={item.id}>
              <strong>
                <b>{item.quantity}×</b>{" "}
                {menuItem?.name ?? "Позиция из прошлого заказа"}
              </strong>
              <span>{item.unitPrice * item.quantity} ₽</span>
              {item.comment ? <p>{item.comment}</p> : null}
            </article>
          );
        })}
      </div>
      <footer>
        <span>Итого</span>
        <strong>{total} ₽</strong>
      </footer>
    </div>
  );
}
