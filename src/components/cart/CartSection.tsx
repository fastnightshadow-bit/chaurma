"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { locations } from "@/data/locations";
import { menuItems } from "@/data/menu";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { scrollToSection } from "@/utils/scrollToSection";
import { Eye, Phone } from "lucide-react";
import { useCallback, useState } from "react";
import styles from "../site.module.css";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { EmptyState } from "../ui/EmptyState";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { ClearCartButton } from "./ClearCartButton";
import { OrderPresentationModal } from "./OrderPresentationModal";
import { OrderCommentField } from "./OrderCommentField";

export function CartSection() {
  const { state, dispatch, isHydrated, storageUnavailable, resolveStaleCart } =
    useAppState();
  const [confirmClear, setConfirmClear] = useState(false);
  const location =
    locations.find((entry) => entry.id === state.selectedLocationId) ??
    locations[0];
  const status = useBusinessStatus(location);
  const total = state.cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const closePresentation = useCallback(
    () => dispatch({ type: "presentation/close" }),
    [dispatch],
  );

  return (
    <section
      id="cart"
      className={`${styles.section} ${styles.cartSection}`}
      aria-labelledby="cart-title"
    >
      <div className={styles.sectionHeadingRow}>
        <div className={styles.sectionHeading}>
          <span>Проверьте заказ</span>
          <h2 id="cart-title">Корзина</h2>
        </div>
        {state.cart.items.length ? (
          <ClearCartButton onClick={() => setConfirmClear(true)} />
        ) : null}
      </div>
      {!isHydrated ? (
        <div
          className={styles.cartLoading}
          aria-label="Восстанавливаем корзину"
        />
      ) : null}
      {isHydrated && state.cart.items.length === 0 ? (
        <EmptyState
          title="Корзина пока пуста"
          text="Добавьте блюда из меню, затем позвоните или покажите заказ продавцу."
          action={
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => scrollToSection("menu")}
            >
              Выбрать блюда
            </button>
          }
        />
      ) : null}
      {state.cart.items.length ? (
        <>
          <div className={styles.cartList}>
            {state.cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                menuItem={menuItems.find(
                  (entry) => entry.id === item.menuItemId,
                )}
              />
            ))}
          </div>
          <OrderCommentField />
          <CartSummary location={location} total={total} />
          <div className={styles.cartActions}>
            <a className={styles.primaryButton} href={`tel:${location.phone}`}>
              <Phone size={20} />{" "}
              {status !== "open"
                ? "Позвонить и уточнить"
                : "Позвонить и заказать"}
            </a>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => dispatch({ type: "presentation/open" })}
            >
              <Eye size={20} /> Показать заказ продавцу
            </button>
          </div>
        </>
      ) : null}
      {storageUnavailable ? (
        <p className={styles.inlineNotice}>
          Корзина сохранится только до закрытия этой вкладки.
        </p>
      ) : null}
      {state.cartRestoreStatus === "invalid" ? (
        <p className={styles.inlineNotice}>
          Сохранённую корзину не удалось восстановить. Соберите заказ заново.
        </p>
      ) : null}
      {state.cartRestoreStatus === "stale" ? (
        <ConfirmDialog
          title="Ваш прошлый заказ устарел. Проверить актуальность?"
          description="Выберите, оставить прошлые позиции с актуальными ценами или очистить корзину."
          primaryLabel="Обновить цены и оставить заказ"
          secondaryLabel="Очистить корзину"
          onPrimary={() => resolveStaleCart("refresh")}
          onSecondary={() => resolveStaleCart("clear")}
        />
      ) : null}
      {confirmClear ? (
        <ConfirmDialog
          title="Очистить корзину?"
          description="Все выбранные позиции будут удалены."
          primaryLabel="Очистить корзину"
          secondaryLabel="Отмена"
          destructive
          onPrimary={() => {
            dispatch({ type: "cart/clear" });
            setConfirmClear(false);
          }}
          onSecondary={() => setConfirmClear(false)}
        />
      ) : null}
      {state.isOrderPresentationOpen ? (
        <OrderPresentationModal cart={state.cart} onClose={closePresentation} />
      ) : null}
    </section>
  );
}
