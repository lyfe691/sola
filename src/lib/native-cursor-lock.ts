/** Hide the OS cursor while the custom cursor is active. */

export const applyNativeCursorLock = (enabled: boolean) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;

  if (enabled) {
    root.classList.add("sola-custom-cursor");
    root.style.setProperty("cursor", "none", "important");
    body.style.setProperty("cursor", "none", "important");
    return;
  }

  root.classList.remove("sola-custom-cursor");
  root.style.removeProperty("cursor");
  body.style.removeProperty("cursor");
};