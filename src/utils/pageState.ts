export function isPageActive(): boolean {
  return document.hasFocus() && document.visibilityState === "visible";
}
