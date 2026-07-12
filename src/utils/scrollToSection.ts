import type { SectionId } from "@/state/initialState";

export function scrollToSection(section: SectionId): void {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  if (section === "home") window.scrollTo({ top: 0, behavior });
  else
    document
      .getElementById(section)
      ?.scrollIntoView({ behavior, block: "start" });
  window.history.replaceState(null, "", `#${section}`);
}
