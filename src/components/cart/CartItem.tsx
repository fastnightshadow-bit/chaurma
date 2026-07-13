"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import {
  ITEM_COMMENT_MAX_LENGTH,
  type CartItem as CartItemType,
} from "@/types/cart";
import type { MenuItem } from "@/types/menu";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "../site.module.css";
import { QuantityControl } from "../menu/QuantityControl";
import { FoodPlaceholder } from "../ui/FoodPlaceholder";

export function CartItem({
  item,
  menuItem,
}: Readonly<{ item: CartItemType; menuItem?: MenuItem }>) {
  const { dispatch } = useAppState();
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState(item.comment);
  const commentId = useId();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const name = menuItem?.name ?? "Позиция больше не найдена в меню";

  useEffect(() => {
    if (!isEditingComment) setCommentDraft(item.comment);
  }, [isEditingComment, item.comment]);

  useEffect(() => {
    if (isEditingComment) commentInputRef.current?.focus();
  }, [isEditingComment]);

  const saveComment = () => {
    dispatch({
      type: "cart/setItemComment",
      itemId: item.id,
      comment: commentDraft,
    });
    setIsEditingComment(false);
  };

  const removeComment = () => {
    dispatch({ type: "cart/setItemComment", itemId: item.id, comment: "" });
    setCommentDraft("");
    setIsEditingComment(false);
  };

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

        {item.comment && !isEditingComment ? (
          <p className={styles.cartItemComment}>
            <MessageCircle size={16} aria-hidden="true" />
            <span>{item.comment}</span>
          </p>
        ) : null}

        {!isEditingComment ? (
          <button
            type="button"
            className={`${styles.textButton} ${styles.cartCommentToggle}`}
            onClick={() => setIsEditingComment(true)}
            aria-controls={commentId}
          >
            {item.comment ? (
              <Pencil size={16} aria-hidden="true" />
            ) : (
              <MessageCircle size={16} aria-hidden="true" />
            )}
            {item.comment ? "Изменить пожелание" : "Добавить пожелание"}
          </button>
        ) : (
          <div id={commentId} className={styles.commentEditor}>
            <label htmlFor={`${commentId}-input`}>Пожелание к блюду</label>
            <textarea
              ref={commentInputRef}
              id={`${commentId}-input`}
              value={commentDraft}
              maxLength={ITEM_COMMENT_MAX_LENGTH}
              rows={2}
              placeholder="Например: без лука"
              onChange={(event) => setCommentDraft(event.target.value)}
            />
            <div className={styles.commentEditorMeta}>
              <span>
                {commentDraft.length}/{ITEM_COMMENT_MAX_LENGTH}
              </span>
            </div>
            <div className={styles.commentEditorActions}>
              <button
                type="button"
                className={styles.commentSaveButton}
                onClick={saveComment}
              >
                Сохранить пожелание
              </button>
              {item.comment ? (
                <button
                  type="button"
                  className={styles.commentDeleteButton}
                  onClick={removeComment}
                >
                  Удалить пожелание
                </button>
              ) : null}
              <button
                type="button"
                className={styles.commentCancelButton}
                onClick={() => {
                  setCommentDraft(item.comment);
                  setIsEditingComment(false);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
