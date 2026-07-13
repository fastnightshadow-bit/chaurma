import { MapPin } from "lucide-react";
import styles from "../site.module.css";

export function MapPlaceholder({
  loading = false,
}: Readonly<{ loading?: boolean }>) {
  return (
    <div
      className={`${styles.mapPlaceholder} ${loading ? styles.mapLoading : ""}`}
      role="img"
      aria-label={loading ? "Карта загружается" : "Карта временно недоступна"}
    >
      <span className={styles.mapRoadOne} />
      <span className={styles.mapRoadTwo} />
      <span className={styles.mapRoadThree} />
      <MapPin size={34} aria-hidden="true" />
      <strong>
        {loading ? "Загружаем карту" : "Карта временно недоступна"}
      </strong>
    </div>
  );
}
