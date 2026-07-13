import { locations } from "@/data/locations";
import styles from "../site.module.css";

const vkUrl = locations
  .flatMap((location) => location.socialLinks)
  .find((url) => new URL(url).hostname === "vk.com");

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      {vkUrl ? (
        <a href={vkUrl} target="_blank" rel="noopener noreferrer">
          <span className={styles.vkIcon} aria-hidden="true">
            VK
          </span>
          Мы во ВКонтакте
        </a>
      ) : null}
    </footer>
  );
}
