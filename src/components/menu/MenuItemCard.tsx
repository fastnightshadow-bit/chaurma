"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import type { MenuItem } from "@/types/menu";
import { Flame, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "../site.module.css";
import { FoodPlaceholder } from "../ui/FoodPlaceholder";
import { ItemOptions } from "./ItemOptions";
import { QuantityControl } from "./QuantityControl";

export function MenuItemCard({
  item,
  onAdded,
}: Readonly<{ item: MenuItem; onAdded: (name: string) => void }>) {
  const { state, dispatch } = useAppState();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([]);
  const cartId = useMemo(
    () => [item.id, ...selectedOptions.slice().sort()].join("::"),
    [item.id, selectedOptions],
  );
  const cartItem = state.cart.items.find((entry) => entry.id === cartId);

  function add() {
    if (!item.available) return;
    if (item.options.length > 0 && !showOptions) {
      setShowOptions(true);
      return;
    }
    const optionsPrice = item.options
      .filter((option) => selectedOptions.includes(option.id))
      .reduce((sum, option) => sum + option.priceDelta, 0);
    dispatch({
      type: "cart/add",
      item: {
        id: cartId,
        menuItemId: item.id,
        quantity: 1,
        unitPrice: item.price + optionsPrice,
        optionIds: selectedOptions,
        comment: "",
      },
    });
    onAdded(item.name);
  }

  return (
    <article
      className={`${styles.menuCard} ${!item.available ? styles.menuCardUnavailable : ""}`}
    >
      <div className={styles.menuImage}>
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="128px"
            className={styles.foodImage}
          />
        ) : (
          <FoodPlaceholder compact />
        )}
        <div className={styles.badges}>
          {item.badges.includes("hit") ? (
            <span className={styles.badgeHit}>
              <Star size={12} /> Хит
            </span>
          ) : null}
          {item.badges.includes("spicy") ? (
            <span className={styles.badgeSpicy}>
              <Flame size={12} /> Острое
            </span>
          ) : null}
        </div>
      </div>
      <div className={styles.menuCardBody}>
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <span className={styles.weight}>{item.weight}</span>
        <div className={styles.menuCardFooter}>
          <strong>{item.price} ₽</strong>
          {!item.available ? (
            <span className={styles.unavailableLabel}>Нет в наличии</span>
          ) : cartItem ? (
            <QuantityControl
              quantity={cartItem.quantity}
              label={item.name}
              onDecrease={() =>
                dispatch({
                  type: "cart/setQuantity",
                  itemId: cartItem.id,
                  quantity: cartItem.quantity - 1,
                })
              }
              onIncrease={add}
            />
          ) : (
            <button
              type="button"
              className={styles.addButton}
              onClick={add}
              aria-label={`Добавить: ${item.name}`}
            >
              <Plus size={21} />
            </button>
          )}
        </div>
      </div>
      {showOptions ? (
        <div className={styles.optionsPanel}>
          <ItemOptions
            options={item.options}
            selected={selectedOptions}
            onChange={setSelectedOptions}
          />
          <button type="button" className={styles.primaryButton} onClick={add}>
            Добавить выбранное
          </button>
        </div>
      ) : null}
    </article>
  );
}
