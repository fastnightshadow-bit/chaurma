export function supportsWakeLock(): boolean {
  return typeof navigator !== "undefined" && "wakeLock" in navigator;
}
