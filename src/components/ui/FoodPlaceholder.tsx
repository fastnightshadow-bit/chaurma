import styles from "../site.module.css";

export function FoodPlaceholder({
  compact = false,
}: Readonly<{ compact?: boolean }>) {
  return (
    <div
      className={`${styles.foodPlaceholder} ${compact ? styles.foodPlaceholderCompact : ""}`}
      role="img"
      aria-label="Временная фирменная заглушка фотографии блюда"
    >
      <span className={styles.placeholderGlow} />
      <span className={styles.placeholderWrap}>
        <span className={styles.placeholderFilling} />
      </span>
      <span className={styles.placeholderLabel}>Фото скоро</span>
    </div>
  );
}
