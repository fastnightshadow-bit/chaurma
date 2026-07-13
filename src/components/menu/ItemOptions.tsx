"use client";

import type { MenuOption } from "@/types/menu";
import styles from "../site.module.css";

export function ItemOptions({
  options,
  selected,
  onChange,
}: Readonly<{
  options: readonly MenuOption[];
  selected: readonly string[];
  onChange: (ids: readonly string[]) => void;
}>) {
  if (options.length === 0) return null;
  return (
    <fieldset className={styles.itemOptions}>
      <legend>Добавки</legend>
      {options.map((option) => (
        <label key={option.id}>
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            disabled={!option.available}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? [...selected, option.id]
                  : selected.filter((id) => id !== option.id),
              )
            }
          />
          <span>{option.name}</span>
          {option.priceDelta ? <small>+{option.priceDelta} ₽</small> : null}
        </label>
      ))}
    </fieldset>
  );
}
