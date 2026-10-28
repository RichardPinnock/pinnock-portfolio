/**
 * Brand colors as hex for the places that cannot use CSS variables (generated images, the web manifest,
 * the browser theme color). They are the sRGB conversions of the OKLCH tokens in globals.css; update
 * them together.
 */
export const brand = {
  /** --background: oklch(0.15 0.012 275) */
  background: "#0a0b10",
  /** --brand-500: oklch(0.56 0.19 285) */
  primary: "#6e5bdd",
  /** --brand-300: oklch(0.8 0.1 285) */
  accent: "#b7b5fc",
  /** --foreground: oklch(0.96 0.008 275) */
  foreground: "#f0f1f7",
} as const;

/** "Richard Pinnock" -> "RP" */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
