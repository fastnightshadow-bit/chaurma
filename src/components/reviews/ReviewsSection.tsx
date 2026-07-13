"use client";

import { useAppState } from "@/components/app/AppStateProvider";
import { locations } from "@/data/locations";
import { ExternalLink, Star } from "lucide-react";
import styles from "../site.module.css";

function pluralize(
  count: number,
  forms: readonly [string, string, string],
): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 19) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export function ReviewsSection() {
  const { state } = useAppState();
  const location =
    locations.find((entry) => entry.id === state.selectedLocationId) ??
    locations[0];
  const { socialProof } = location;

  return (
    <section
      className={`${styles.section} ${styles.reviewsSection}`}
      aria-labelledby="reviews-title"
    >
      <div className={styles.sectionHeading}>
        <span>Отзывы гостей</span>
        <h2 id="reviews-title">Нас выбирают</h2>
      </div>

      <div className={styles.ratingSummary}>
        <div
          className={styles.ratingValue}
          aria-label={`Рейтинг ${socialProof.rating} из 5`}
        >
          <Star size={22} aria-hidden="true" />
          <strong>{socialProof.rating.toLocaleString("ru-RU")}</strong>
          <span>из 5</span>
        </div>
        <div className={styles.ratingCounts}>
          <span>
            {socialProof.ratingCount}{" "}
            {pluralize(socialProof.ratingCount, ["оценка", "оценки", "оценок"])}
          </span>
          <span>
            {socialProof.reviewCount}{" "}
            {pluralize(socialProof.reviewCount, ["отзыв", "отзыва", "отзывов"])}
          </span>
        </div>
      </div>

      <p className={styles.reviewSummaryLabel}>
        По отзывам гостей чаще всего отмечают:
      </p>
      <ul className={styles.reviewHighlights}>
        {socialProof.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <a
        className={styles.reviewsLink}
        href={socialProof.reviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Читать отзывы на Яндекс Картах
        <ExternalLink size={18} aria-hidden="true" />
      </a>
    </section>
  );
}
