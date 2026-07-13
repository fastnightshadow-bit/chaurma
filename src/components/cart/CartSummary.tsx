import type { Location } from "@/types/location";
import { Clock3, MapPin } from "lucide-react";
import styles from "../site.module.css";

export function CartSummary({
  location,
  total,
}: Readonly<{ location: Location; total: number }>) {
  return (
    <div className={styles.cartSummary}>
      <div>
        <span>
          <MapPin size={17} /> Точка
        </span>
        <strong>{location.name}</strong>
      </div>
      <div>
        <span>
          <Clock3 size={17} /> Приготовление
        </span>
        <strong>{location.preparationTime}</strong>
      </div>
      <div className={styles.totalRow}>
        <span>Итого</span>
        <strong>{total} ₽</strong>
      </div>
    </div>
  );
}
