"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import type { CartItem as CartItemType } from "@/types/cart";
import type { MenuItem } from "@/types/menu";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import styles from "../site.module.css";
import { QuantityControl } from "../menu/QuantityControl";
import { FoodPlaceholder } from "../ui/FoodPlaceholder";

export function CartItem({
  item,
  menuItem,
}: Readonly<{ item: CartItemType; menuItem?: MenuItem }>) {
  const { dispatch } = useAppState();
  const name = menuItem?.name ?? "Позиция больше не найдена в меню";

  return (
    <article className={styles.cartItem}>
      <div className={styles.cartThumb}>
        {menuItem?.image ? (
          <Image
            src={menuItem.image.src}
            alt=""
            fill
            sizes="72px"
            className={styles.foodImage}
          />
        ) : (
          <FoodPlaceholder compact />
        )}
      </div>
      <div className={styles.cartItemBody}>
        <div className={styles.cartItemTop}>
          <div>
            <h3>{name}</h3>
            {item.optionIds.length ? (
              <p>Добавки: {item.optionIds.join(", ")}</p>
            ) : null}
            {item.comment ? <p>Комментарий: {item.comment}</p> : null}
          </div>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => dispatch({ type: "cart/remove", itemId: item.id })}
            aria-label={`Удалить: ${name}`}
          >
            <Trash2 size={19} />
          </button>
        </div>
        <div className={styles.cartItemBottom}>
          <strong>{item.unitPrice * item.quantity} ₽</strong>
          <QuantityControl
            quantity={item.quantity}
            label={name}
            onDecrease={() =>
              dispatch({
                type: "cart/setQuantity",
                itemId: item.id,
                quantity: item.quantity - 1,
              })
            }
            onIncrease={() =>
              dispatch({
                type: "cart/setQuantity",
                itemId: item.id,
                quantity: item.quantity + 1,
              })
            }
          />
        </div>
      </div>
    </article>
  );
}
