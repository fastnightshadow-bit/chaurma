"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { ORDER_COMMENT_MAX_LENGTH } from "@/types/cart";
import styles from "../site.module.css";

export function OrderCommentField() {
  const { state, dispatch } = useAppState();
  const comment = state.cart.orderComment;

  return (
    <div className={styles.orderCommentField}>
      <label htmlFor="order-comment">Комментарий ко всему заказу</label>
      <textarea
        id="order-comment"
        value={comment}
        maxLength={ORDER_COMMENT_MAX_LENGTH}
        rows={3}
        placeholder="Например: буду через 15 минут"
        onChange={(event) =>
          dispatch({
            type: "cart/setOrderComment",
            comment: event.target.value,
          })
        }
        onBlur={(event) =>
          dispatch({
            type: "cart/setOrderComment",
            comment: event.target.value.trim(),
          })
        }
      />
      <span aria-live="polite">
        {comment.length}/{ORDER_COMMENT_MAX_LENGTH}
      </span>
    </div>
  );
}
