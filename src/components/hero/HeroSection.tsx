"use client";

import { siteConfig } from "@/data/siteConfig";
import { publicPath } from "@/utils/publicPath";
import { scrollToSection } from "@/utils/scrollToSection";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import styles from "../site.module.css";

export function HeroSection() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroVisual}>
        <picture className={styles.heroPicture}>
          <source
            media="(max-width: 760px)"
            srcSet={publicPath("/images/hero/hero-shawarma-mobile.webp")}
            type="image/webp"
          />
          <Image
            className={styles.heroImage}
            src={publicPath("/images/hero/hero-shawarma.webp")}
            alt="Шаурма с мясом, свежими овощами и фирменным соусом"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 760px"
          />
        </picture>
      </div>
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>{siteConfig.name}</p>
        <h1 id="hero-title">{siteConfig.heroTitle}</h1>
        <p>{siteConfig.heroSubtitle}</p>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => scrollToSection("menu")}
        >
          Смотреть меню <ArrowDown size={20} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
