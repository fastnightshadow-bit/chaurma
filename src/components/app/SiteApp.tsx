"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { CartSection } from "../cart/CartSection";
import { HeroSection } from "../hero/HeroSection";
import { BottomNavigation } from "../layout/BottomNavigation";
import { SiteFooter } from "../layout/SiteFooter";
import { TopBar } from "../layout/TopBar";
import { MapSection } from "../map/MapSection";
import { MenuSection } from "../menu/MenuSection";
import { ShawarmaProgress } from "../progress/ShawarmaProgress";
import { ReviewsSection } from "../reviews/ReviewsSection";
import styles from "../site.module.css";

export function SiteApp() {
  useActiveSection();
  return (
    <>
      <TopBar />
      <ShawarmaProgress />
      <main id="main-content" className={styles.page}>
        <HeroSection />
        <MenuSection />
        <CartSection />
        <MapSection />
        <ReviewsSection />
      </main>
      <SiteFooter />
      <BottomNavigation />
    </>
  );
}
