// Verifies WCAG AA contrast for the design tokens declared in globals.css.
// Run with `pnpm contrast`; exits non-zero if any pair fails.
import { readFileSync } from "node:fs";

type Rgb = [number, number, number];

const CSS_PATH = new URL("../src/app/globals.css", import.meta.url);
const css = readFileSync(CSS_PATH, "utf8");

const tokens = new Map<string, string>();
for (const match of css.matchAll(/(--[\w-]+):\s*(oklch\([^)]+\))\s*;/g)) {
  tokens.set(match[1], match[2]);
}

function oklchToRgb(value: string): Rgb {
  const parts = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!parts) throw new Error(`Cannot parse ${value}`);
  const [l, c, h] = [
    Number(parts[1]),
    Number(parts[2]),
    (Number(parts[3]) * Math.PI) / 180,
  ];
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear: Rgb = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  // Clamping approximates what browsers do for out-of-gamut colors closely enough for a contrast check.
  return linear.map((v) => Math.min(1, Math.max(0, v))) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const [lf, lb] = [foreground, background].map((t) =>
    luminance(oklchToRgb(resolve(t))),
  );
  const [light, dark] = lf > lb ? [lf, lb] : [lb, lf];
  return (light + 0.05) / (dark + 0.05);
}

function resolve(nameOrValue: string): string {
  if (nameOrValue.startsWith("oklch(")) return nameOrValue;
  const value = tokens.get(nameOrValue);
  if (!value) throw new Error(`Unknown token ${nameOrValue}`);
  return value;
}

// [foreground, background, minimum ratio, description]
// 4.5 for body text, 3 for large text and UI component boundaries (WCAG 1.4.3 / 1.4.11).
const checks: [string, string, number, string][] = [
  ["--foreground", "--background", 4.5, "body text"],
  ["--card-foreground", "--card", 4.5, "text on card"],
  ["--popover-foreground", "--popover", 4.5, "text on popover"],
  ["--muted-foreground", "--background", 4.5, "muted text on background"],
  ["--muted-foreground", "--card", 4.5, "muted text on card"],
  ["--muted-foreground", "--muted", 4.5, "muted text on muted"],
  ["--primary-foreground", "--primary", 4.5, "button label on primary"],
  ["--secondary-foreground", "--secondary", 4.5, "text on secondary"],
  ["--accent-foreground", "--accent", 4.5, "text on accent"],
  ["--destructive", "--background", 4.5, "destructive text on background"],
  ["oklch(0.8 0.1 285)", "--background", 4.5, "link (brand-300) on background"],
  ["oklch(0.8 0.1 285)", "--card", 4.5, "link (brand-300) on card"],
  ["--ring", "--background", 3, "focus ring on background"],
  ["--ring", "--card", 3, "focus ring on card"],
  ["--input", "--background", 3, "input boundary on background"],
  ["--primary", "--background", 3, "primary fill vs background"],
];

let failed = 0;
for (const [fg, bg, min, label] of checks) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${ratio.toFixed(2).padStart(5)} (min ${min})  ${label}`,
  );
}

if (failed > 0) {
  console.error(`\n${failed} contrast check(s) failed.`);
  process.exit(1);
}
console.log("\nAll contrast checks passed.");
